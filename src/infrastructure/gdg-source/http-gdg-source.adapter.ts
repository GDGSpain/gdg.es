/**
 * RF-SYNC-001, RF-SYNC-002, ADR-0005: cliente HTTP de gdg.community.dev que implementa GdgSourcePort.
 *
 * Solo pide páginas públicas, comprueba robots.txt antes de cada petición, respeta la pausa mínima
 * entre peticiones (`SYNC_DELAY_MS`, nunca menos que el Crawl-delay) y se identifica con
 * `SYNC_USER_AGENT`.
 */
import type { GdgSourcePort, SourceChapter, SourceError } from "@/modules/sync/ports/gdg-source.port";
import { err, ok, type Result } from "@/shared/result";
import { SLUG_PATTERN, chapterSlugFromUrl, parseChapterPage, parseSitemapUrls } from "./next-data.parser";
import { FALLBACK_RULES, isAllowed, parseRobots, type RobotsRules } from "./robots";

export interface HttpGdgSourceOptions {
  baseUrl: string;
  userAgent: string;
  minDelayMs: number;
  fetchImpl?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  timeoutMs?: number;
}

/** Tope de tamaño de una respuesta de la fuente. */
const MAX_BODY_BYTES = 5 * 1024 * 1024;
/** Saltos de redirección permitidos (cada uno se valida contra robots.txt y el origen). */
const MAX_REDIRECTS = 3;

export class HttpGdgSource implements GdgSourcePort {
  private rules: RobotsRules | null = null;
  private lastRequestAt = -Infinity;
  private readonly fetchImpl: typeof fetch;
  private readonly sleep: (ms: number) => Promise<void>;
  private readonly now: () => number;

  constructor(private readonly opts: HttpGdgSourceOptions) {
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
    this.now = opts.now ?? (() => Date.now());
  }

  /** {@inheritDoc GdgSourcePort.getChapter} */
  async getChapter(slug: string): Promise<Result<SourceChapter, SourceError>> {
    if (!SLUG_PATTERN.test(slug)) return err({ kind: "invalid", detail: `slug no válido: ${slug}` });
    const page = await this.get(`/${slug}/`);
    if (!page.ok) return page;
    const parsed = parseChapterPage(page.value);
    if (!parsed.ok) return err(parsed.error);
    if (parsed.value.slug !== slug) {
      return err({ kind: "invalid", detail: `la página de ${slug} dice ser ${parsed.value.slug}` });
    }
    return parsed;
  }

  /**
   * Slugs de todos los capítulos del sitemap (descubrimiento de capítulos nuevos, RF-SYNC-002).
   * @param maxPages páginas de `sitemap-chapters.xml` a recorrer
   */
  async listChapterSlugs(maxPages = 10): Promise<Result<string[], SourceError>> {
    const slugs = new Set<string>();
    for (let p = 1; p <= maxPages; p++) {
      const res = await this.get(p === 1 ? "/sitemap-chapters.xml" : `/sitemap-chapters.xml?p=${p}`);
      if (!res.ok) {
        if (res.error.kind === "not-found" && p > 1) break;
        return res;
      }
      const urls = parseSitemapUrls(res.value);
      if (urls.length === 0) break;
      for (const u of urls) {
        const s = chapterSlugFromUrl(u);
        if (s) slugs.add(s);
      }
    }
    return ok([...slugs].sort());
  }

  /** GET con robots.txt, pausa e identificación. Devuelve el cuerpo como texto. */
  private async get(path: string): Promise<Result<string, SourceError>> {
    const rules = await this.robots();
    if (!isAllowed(path, rules)) return err({ kind: "forbidden", path });
    return this.request(path);
  }

  private async robots(): Promise<RobotsRules> {
    if (this.rules) return this.rules;
    const res = await this.request("/robots.txt");
    const parsed = res.ok ? parseRobots(res.value) : FALLBACK_RULES;
    // Si robots.txt viniera vacío o sin las rutas sensibles, se mantienen las conocidas.
    this.rules = {
      disallow: [...new Set([...FALLBACK_RULES.disallow, ...parsed.disallow])],
      crawlDelaySeconds: Math.max(parsed.crawlDelaySeconds, FALLBACK_RULES.crawlDelaySeconds),
    };
    return this.rules;
  }

  private async request(path: string, hops = 0): Promise<Result<string, SourceError>> {
    const minGap = Math.max(this.opts.minDelayMs, (this.rules?.crawlDelaySeconds ?? 0) * 1000);
    const wait = this.lastRequestAt + minGap - this.now();
    if (wait > 0) await this.sleep(wait);
    this.lastRequestAt = this.now();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.opts.timeoutMs ?? 20_000);
    try {
      const base = new URL(this.opts.baseUrl);
      const res = await this.fetchImpl(new URL(path, base), {
        headers: { "User-Agent": this.opts.userAgent, Accept: "text/html,application/xml;q=0.9,*/*;q=0.8" },
        // Las redirecciones se validan a mano: mismo origen y permitidas por robots.txt (ADR-0005).
        redirect: "manual",
        signal: controller.signal,
      });
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location || hops >= MAX_REDIRECTS)
          return err({ kind: "unavailable", detail: `redirección no seguida (${res.status})` });
        const target = new URL(location, new URL(path, base));
        if (target.origin !== base.origin) return err({ kind: "forbidden", path: target.href });
        const nextPath = target.pathname + target.search;
        if (this.rules && !isAllowed(nextPath, this.rules)) return err({ kind: "forbidden", path: nextPath });
        return this.request(nextPath, hops + 1);
      }
      if (res.status === 404 || res.status === 410) return err({ kind: "not-found" });
      if (!res.ok) return err({ kind: "unavailable", detail: `HTTP ${res.status}` });
      const declared = Number(res.headers.get("content-length") ?? 0);
      if (declared > MAX_BODY_BYTES) return err({ kind: "invalid", detail: "respuesta demasiado grande" });
      const body = await res.text();
      if (body.length > MAX_BODY_BYTES) return err({ kind: "invalid", detail: "respuesta demasiado grande" });
      return ok(body);
    } catch (e) {
      return err({ kind: "unavailable", detail: e instanceof Error ? e.message : String(e) });
    } finally {
      clearTimeout(timer);
    }
  }
}

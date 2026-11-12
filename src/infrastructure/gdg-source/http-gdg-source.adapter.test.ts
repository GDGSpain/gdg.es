/** RF-SYNC-001, RF-SYNC-002, ADR-0005: el cliente HTTP respeta robots.txt, la pausa y la identificación. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HttpGdgSource } from "./http-gdg-source.adapter";

const fixture = (name: string) =>
  readFileSync(new URL(`../../sync/__fixtures__/${name}`, import.meta.url), "utf8");

function setup(routes: Record<string, { status: number; body?: string }>, minDelayMs = 2000) {
  let clock = 0;
  const waits: number[] = [];
  const calls: { url: string; ua: string | null }[] = [];
  const fetchImpl = (async (input: URL | string, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({ url: url.pathname + url.search, ua: new Headers(init?.headers).get("User-Agent") });
    const route = routes[url.pathname + url.search] ?? { status: 404 };
    return new Response(route.body ?? "", { status: route.status });
  }) as typeof fetch;
  const source = new HttpGdgSource({
    baseUrl: "https://gdg.community.dev",
    userAgent: "gdg.es-directory (+https://gdg.es)",
    minDelayMs,
    fetchImpl,
    now: () => clock,
    sleep: async (ms) => {
      waits.push(ms);
      clock += ms;
    },
  });
  return { source, calls, waits };
}

const robots = { status: 200, body: fixture("robots.txt") };

describe("HttpGdgSource", () => {
  it("lee un capítulo de su página pública identificándose con el User-Agent", async () => {
    const { source, calls } = setup({
      "/robots.txt": robots,
      "/gdg-madrid/": { status: 200, body: fixture("chapter-gdg-madrid.html") },
    });

    const result = await source.getChapter("gdg-madrid");

    expect(result.ok && result.value.sourceId).toBe(975);
    expect(calls.map((c) => c.url)).toEqual(["/robots.txt", "/gdg-madrid/"]);
    expect(calls.every((c) => c.ua === "gdg.es-directory (+https://gdg.es)")).toBe(true);
  });

  it("espera al menos 2 s entre peticiones", async () => {
    const { source, waits } = setup({
      "/robots.txt": robots,
      "/gdg-madrid/": { status: 200, body: fixture("chapter-gdg-madrid.html") },
      "/gdg-on-campus-ie-university-madrid-spain/": {
        status: 200,
        body: fixture("chapter-gdg-on-campus-ie.html"),
      },
    });

    await source.getChapter("gdg-madrid");
    await source.getChapter("gdg-on-campus-ie-university-madrid-spain");

    expect(waits).toEqual([2000, 2000]);
  });

  it("nunca pide una ruta prohibida por robots.txt", async () => {
    const { source, calls } = setup({
      "/robots.txt": { status: 200, body: "User-agent: *\nDisallow: /gdg-secreto/\n" },
    });

    const result = await source.getChapter("gdg-secreto");

    expect(result).toEqual({ ok: false, error: { kind: "forbidden", path: "/gdg-secreto/" } });
    expect(calls.map((c) => c.url)).toEqual(["/robots.txt"]);
  });

  it("mantiene prohibidas /api/ y /u/ aunque robots.txt no se pueda descargar", async () => {
    const { source, calls } = setup({ "/robots.txt": { status: 503 } });

    expect(await source.getChapter("api")).toEqual({
      ok: false,
      error: { kind: "forbidden", path: "/api/" },
    });
    expect(await source.getChapter("u")).toEqual({ ok: false, error: { kind: "forbidden", path: "/u/" } });
    expect(calls.map((c) => c.url)).toEqual(["/robots.txt"]);
  });

  it("rechaza slugs que intentan salir de la página del capítulo", async () => {
    const { source, calls } = setup({ "/robots.txt": robots });
    expect((await source.getChapter("../api/chapter_region")).ok).toBe(false);
    expect(calls).toEqual([]);
  });

  it("distingue capítulo inexistente (404) de fuente caída (5xx)", async () => {
    const { source } = setup({ "/robots.txt": robots, "/gdg-caido/": { status: 502 } });
    expect(await source.getChapter("gdg-borrado")).toEqual({ ok: false, error: { kind: "not-found" } });
    expect(await source.getChapter("gdg-caido")).toEqual({
      ok: false,
      error: { kind: "unavailable", detail: "HTTP 502" },
    });
  });

  it("lista los slugs de capítulos de todas las páginas del sitemap", async () => {
    const { source } = setup({
      "/robots.txt": robots,
      "/sitemap-chapters.xml": { status: 200, body: fixture("sitemap-chapters.xml") },
      "/sitemap-chapters.xml?p=2": {
        status: 200,
        body: "<urlset><url><loc>https://gdg.community.dev/gdg-zaragoza/</loc></url></urlset>",
      },
      "/sitemap-chapters.xml?p=3": { status: 200, body: "<urlset></urlset>" },
    });

    const result = await source.listChapterSlugs();

    expect(result.ok && result.value).toContain("gdg-nuevo-capitulo-ejemplo");
    expect(result.ok && result.value).toContain("gdg-zaragoza");
    expect(result.ok && result.value).toHaveLength(7);
  });
});

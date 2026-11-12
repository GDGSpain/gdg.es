/**
 * RF-SYNC-001, RF-SYNC-002: lectura de las páginas públicas de gdg.community.dev (ADR-0005).
 *
 * Los datos vienen en `<script id="__NEXT_DATA__">`, que no es un contrato público: se validan con zod
 * para que un cambio de forma falle con un error explícito en vez de guardar datos rotos.
 */
import { z } from "zod";
import type { SourceChapter } from "@/modules/sync/ports/gdg-source.port";
import { err, ok, type Result } from "@/shared/result";

/** Cadena vacía o nula → null. */
const emptyToNull = z
  .string()
  .nullish()
  .transform((v) => (v && v.trim() !== "" ? v.trim() : null));

/** URL absoluta válida o null (la fuente mezcla "", null y URLs sin esquema). */
const urlOrNull = emptyToNull.transform((v) => {
  if (!v) return null;
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  return z.url().safeParse(withScheme).success ? withScheme : null;
});

const chapterDataSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  country: z.string().length(2),
  city: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  state: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  logo: urlOrNull,
  cropped_logo_url: urlOrNull,
  cropped_banner_url: urlOrNull,
  description: z
    .string()
    .nullish()
    .transform((v) => v ?? ""),
  website: urlOrNull,
  twitter_handle: emptyToNull,
  linkedin_page: urlOrNull,
  instagram_handle: emptyToNull,
  members_count: z
    .number()
    .int()
    .nonnegative()
    .nullish()
    .transform((v) => v ?? null),
  is_active: z.boolean(),
  is_hidden: z.boolean().default(false),
  url: z.url(),
});

const chapterPageSchema = z.object({
  props: z.object({
    pageProps: z.object({
      chapterSlug: z.string().min(1),
      chapterData: chapterDataSchema,
    }),
  }),
});

export type ParseError = { kind: "invalid"; detail: string };

/**
 * Extrae el JSON de `__NEXT_DATA__` de una página.
 * @param html página completa
 */
export function extractNextData(html: string): Result<unknown, ParseError> {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return err({ kind: "invalid", detail: "la página no contiene __NEXT_DATA__" });
  try {
    return ok(JSON.parse(match[1]));
  } catch {
    return err({ kind: "invalid", detail: "__NEXT_DATA__ no es JSON válido" });
  }
}

/**
 * Lee el capítulo de su página pública.
 * @param html página `https://gdg.community.dev/{slug}/`
 */
export function parseChapterPage(html: string): Result<SourceChapter, ParseError> {
  const data = extractNextData(html);
  if (!data.ok) return data;
  const parsed = chapterPageSchema.safeParse(data.value);
  if (!parsed.success) {
    const where = parsed.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return err({ kind: "invalid", detail: `forma inesperada del capítulo (${where})` });
  }
  const { chapterSlug, chapterData: c } = parsed.data.props.pageProps;
  return ok({
    sourceId: c.id,
    slug: chapterSlug,
    title: c.title,
    country: c.country.toUpperCase(),
    city: c.city,
    state: c.state,
    latitude: c.latitude,
    longitude: c.longitude,
    logoUrl: c.cropped_logo_url ?? c.logo,
    bannerUrl: c.cropped_banner_url,
    descriptionHtml: c.description,
    website: c.website,
    twitter: c.twitter_handle?.replace(/^@/, "") ?? null,
    linkedin: c.linkedin_page,
    instagram: c.instagram_handle?.replace(/^@/, "") ?? null,
    membersCount: c.members_count,
    active: c.is_active && !c.is_hidden,
    url: c.url,
  });
}

/**
 * Devuelve las URL `<loc>` de un sitemap.
 * @param xml contenido del sitemap
 */
export function parseSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

/**
 * Slug de capítulo a partir de su URL (`https://gdg.community.dev/gdg-madrid/` → `gdg-madrid`);
 * null si la URL no es de un capítulo.
 */
export function chapterSlugFromUrl(url: string): string | null {
  const m = url.match(/^https?:\/\/gdg\.community\.dev\/([a-z0-9-]+)\/?$/i);
  return m ? m[1].toLowerCase() : null;
}

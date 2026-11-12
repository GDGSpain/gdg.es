/** RF-SYNC-001, RF-SYNC-002: parseo de páginas reales de gdg.community.dev (fixtures). */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { chapterSlugFromUrl, extractNextData, parseChapterPage, parseSitemapUrls } from "./next-data.parser";

const fixture = (name: string) =>
  readFileSync(new URL(`../../sync/__fixtures__/${name}`, import.meta.url), "utf8");

describe("parseChapterPage", () => {
  it("lee los datos del capítulo GDG Madrid", () => {
    const result = parseChapterPage(fixture("chapter-gdg-madrid.html"));
    expect(result).toEqual({
      ok: true,
      value: expect.objectContaining({
        sourceId: 975,
        slug: "gdg-madrid",
        title: "GDG Madrid",
        country: "ES",
        city: "Madrid",
        state: "Madrid",
        latitude: 40.42,
        longitude: -3.71,
        website: "http://gdg.es",
        twitter: "gdgmadrid",
        linkedin: "https://www.linkedin.com/company/gdgmadrid",
        instagram: null,
        membersCount: 2283,
        active: true,
        url: "https://gdg.community.dev/gdg-madrid/",
      }),
    });
  });

  it("prefiere el logo recortado y conserva el HTML de la descripción", () => {
    const result = parseChapterPage(fixture("chapter-gdg-madrid.html"));
    if (!result.ok) throw new Error(result.error.detail);
    expect(result.value.logoUrl).toContain("c_fill,w_500,h_500");
    expect(result.value.descriptionHtml.startsWith("<div>")).toBe(true);
  });

  it("acepta un capítulo sin coordenadas, sin logo propio ni web (GDG on Campus)", () => {
    const result = parseChapterPage(fixture("chapter-gdg-on-campus-ie.html"));
    if (!result.ok) throw new Error(result.error.detail);
    expect(result.value).toMatchObject({
      sourceId: 2488,
      latitude: null,
      longitude: null,
      website: null,
      twitter: null,
      instagram: "gdg_ieuniversity",
      state: "Community of Madrid",
    });
  });

  it("falla de forma explícita si la página no trae __NEXT_DATA__", () => {
    expect(parseChapterPage("<html><body>Mantenimiento</body></html>")).toEqual({
      ok: false,
      error: { kind: "invalid", detail: "la página no contiene __NEXT_DATA__" },
    });
  });

  it("falla de forma explícita si cambia la forma de los datos", () => {
    const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({
      props: { pageProps: { chapterSlug: "gdg-x", chapterData: { id: "975", title: "GDG X" } } },
    })}</script>`;
    const result = parseChapterPage(html);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.detail).toMatch(/forma inesperada del capítulo .*chapterData\.id/);
  });

  it("marca inactivo un capítulo oculto en la fuente", () => {
    const html = fixture("chapter-gdg-madrid.html").replace(/"is_hidden": ?false/, '"is_hidden": true');
    const result = parseChapterPage(html);
    expect(result.ok && result.value.active).toBe(false);
  });
});

describe("extractNextData", () => {
  it("rechaza un __NEXT_DATA__ que no es JSON", () => {
    expect(extractNextData('<script id="__NEXT_DATA__">{roto</script>').ok).toBe(false);
  });
});

describe("sitemaps", () => {
  it("extrae las URL de un sitemap", () => {
    expect(parseSitemapUrls(fixture("sitemap-chapters.xml"))).toHaveLength(6);
  });

  it("convierte URL de capítulo en slug y descarta las que no lo son", () => {
    expect(chapterSlugFromUrl("https://gdg.community.dev/gdg-madrid/")).toBe("gdg-madrid");
    expect(
      chapterSlugFromUrl("https://gdg.community.dev/events/details/google-gdg-madrid-presents-x/"),
    ).toBeNull();
    expect(chapterSlugFromUrl("https://example.org/gdg-madrid/")).toBeNull();
  });
});

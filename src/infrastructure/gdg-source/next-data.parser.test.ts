/** RF-SYNC-001, RF-SYNC-002: parseo de páginas reales de gdg.community.dev (fixtures). */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  chapterSlugFromUrl,
  extractNextData,
  parseChapterPage,
  parseSitemapUrls,
  parseTeam,
} from "./next-data.parser";

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

describe("equipo organizador (RF-SYNC-003)", () => {
  it("lee el equipo con id de perfil, nombre, avatar, X y rol, sin empresa ni puesto", () => {
    const result = parseChapterPage(fixture("chapter-gdg-madrid.html"));
    if (!result.ok) throw new Error(result.error.detail);
    expect(result.value.team).toHaveLength(4);
    expect(result.value.team[0]).toEqual({
      profileId: "ejemplo1",
      name: "Persona1 Ejemplo",
      avatarUrl: "https://example.org/avatar-1-250.png",
      twitter: "ejemplo1",
      role: "GDG Organizer",
    });
    expect(result.value.team[1].twitter).toBeNull();
    expect(Object.keys(result.value.team[0])).not.toContain("company");
  });

  it("la misma persona tiene el mismo id en dos capítulos", () => {
    const madrid = parseChapterPage(fixture("chapter-gdg-madrid.html"));
    const campus = parseChapterPage(fixture("chapter-gdg-on-campus-ie.html"));
    if (!madrid.ok || !campus.ok) throw new Error("fixture inválido");
    const ids = (t: { profileId: string }[]) => new Set(t.map((m) => m.profileId));
    const shared = [...ids(madrid.value.team)].filter((id) => ids(campus.value.team).has(id));
    expect(shared).toEqual(["ejemplo9"]);
    expect(campus.value.team.find((m) => m.profileId === "ejemplo9")?.role).toBe("Organizer");
  });

  it("descarta miembros sin perfil válido o sin nombre y quita duplicados", () => {
    const team = parseTeam([
      { title: "Organizer", user: { full_name: "Ana", profile_url: "/u/ana1/" } },
      { title: "Organizer", user: { full_name: "Ana otra vez", profile_url: "/u/ana1/" } },
      { title: "Organizer", user: { full_name: "Sin perfil", profile_url: "/accounts/x/" } },
      { title: "Organizer", user: { full_name: "", first_name: "", profile_url: "/u/vacio/" } },
      "basura",
    ]);
    expect(team.map((m) => m.profileId)).toEqual(["ana1"]);
  });

  it("un capítulo sin equipo en la página tiene equipo vacío", () => {
    const html = fixture("chapter-gdg-madrid.html").replace(/"chapterTeam": ?\[/, '"chapterTeamX": [');
    const result = parseChapterPage(html);
    expect(result.ok && result.value.team).toEqual([]);
  });
});

describe("revisión de seguridad", () => {
  const withData = (patch: (d: string) => string) => patch(fixture("chapter-gdg-madrid.html"));

  it("rechaza una URL de capítulo que no es https://gdg.community.dev", () => {
    for (const bad of [
      "javascript:alert(1)",
      "https://evil.example/gdg-madrid/",
      "http://gdg.community.dev/gdg-madrid/",
    ]) {
      const html = withData((d) =>
        d.replace('"url": "https://gdg.community.dev/gdg-madrid/"', `"url": "${bad}"`),
      );
      expect(parseChapterPage(html).ok).toBe(false);
    }
  });

  it("rechaza un slug con formato no válido", () => {
    const html = withData((d) => d.replace('"chapterSlug": "gdg-madrid"', '"chapterSlug": "Foo Bar"'));
    expect(parseChapterPage(html).ok).toBe(false);
  });

  it("descarta usuarios de X o Instagram que no tienen su formato", () => {
    const html = withData((d) =>
      d
        .replace('"twitter_handle": "gdgmadrid"', '"twitter_handle": "<b>no</b>"')
        .replace('"instagram_handle": null', '"instagram_handle": "@gdg.madrid"'),
    );
    const result = parseChapterPage(html);
    expect(result.ok && [result.value.twitter, result.value.instagram]).toEqual([null, "gdg.madrid"]);
  });
});

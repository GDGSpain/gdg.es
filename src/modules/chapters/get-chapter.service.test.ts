/** RF-CHAPTERS-002: reglas de la ficha de capítulo. */
import { describe, expect, it } from "vitest";
import type { ChapterDetail } from "./chapter";
import { getChapter } from "./get-chapter.service";

const detail = (o: Partial<ChapterDetail> = {}): ChapterDetail => ({
  sourceId: 975,
  slug: "gdg-madrid",
  title: "GDG Madrid",
  city: "Madrid",
  comunidadId: "MD",
  logoUrl: null,
  isCampus: false,
  membersCount: 1,
  active: true,
  hidden: false,
  latitude: null,
  longitude: null,
  bannerUrl: null,
  descriptionHtml: "",
  website: null,
  twitter: null,
  linkedin: null,
  instagram: null,
  sourceUrl: "https://gdg.community.dev/gdg-madrid/",
  syncedAt: new Date(),
  team: [],
  ...o,
});

const deps = (c: ChapterDetail | null) => {
  const asked: string[] = [];
  return {
    asked,
    deps: { reader: { listAll: async () => [], findBySlug: async (s: string) => (asked.push(s), c) } },
  };
};

describe("getChapter", () => {
  it("devuelve un capítulo público", async () => {
    const { deps: d } = deps(detail());
    expect((await getChapter(d, "gdg-madrid")).ok).toBe(true);
  });

  it.each([
    ["no existe", null],
    ["está inactivo", detail({ active: false })],
    ["está oculto", detail({ hidden: true })],
  ])("responde not-found si %s", async (_caso, c) => {
    const { deps: d } = deps(c);
    expect(await getChapter(d, "gdg-madrid")).toEqual({ ok: false, error: { kind: "not-found" } });
  });

  it("no consulta la base de datos con un slug mal formado", async () => {
    const { deps: d, asked } = deps(detail());
    expect((await getChapter(d, "../admin")).ok).toBe(false);
    expect(asked).toEqual([]);
  });

  it("quita del equipo a las personas ocultas y pone primero a quien organiza", async () => {
    const t = (profileId: string, role: string, hidden = false) => ({
      profileId,
      name: profileId,
      avatarUrl: null,
      twitter: null,
      role,
      hidden,
    });
    const { deps: d } = deps(
      detail({
        team: [
          t("zoe", "Tech Guru"),
          t("bea", "Co-Organizer"),
          t("oculta", "Organizer", true),
          t("mar", "GDG Organizer"),
        ],
      }),
    );
    const r = await getChapter(d, "gdg-madrid");
    expect(r.ok && r.value.team.map((m) => m.profileId)).toEqual(["mar", "bea", "zoe"]);
  });
});

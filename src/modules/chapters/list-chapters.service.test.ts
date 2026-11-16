/** RF-CHAPTERS-001: reglas del directorio de capítulos con un lector falso. */
import { describe, expect, it } from "vitest";
import type { ChapterDetail, ChapterSummary } from "./chapter";
import { listChapters } from "./list-chapters.service";
import type { ChapterReaderPort } from "./ports/chapter-reader.port";

const c = (slug: string, o: Partial<ChapterSummary> = {}): ChapterSummary => ({
  sourceId: slug.length,
  slug,
  title: `GDG ${slug}`,
  city: slug,
  comunidadId: "MD",
  logoUrl: null,
  isCampus: false,
  membersCount: null,
  active: true,
  hidden: false,
  ...o,
});

const reader = (items: ChapterSummary[]): ChapterReaderPort => ({
  listAll: async () => items,
  findBySlug: async () => null as ChapterDetail | null,
});

const data = [
  c("Madrid"),
  c("Málaga", { comunidadId: "AN", city: "Málaga" }),
  c("Sevilla", { comunidadId: "AN" }),
  c("Cerrado", { active: false }),
  c("Oculto", { hidden: true, comunidadId: "GA" }),
  c("Sin región", { comunidadId: null }),
];

describe("listChapters", () => {
  it("muestra solo los capítulos activos y no ocultos, por orden alfabético", async () => {
    const r = await listChapters({ reader: reader(data) });
    expect(r.ok && r.value.chapters.map((x) => x.slug)).toEqual([
      "Madrid",
      "Málaga",
      "Sevilla",
      "Sin región",
    ]);
    expect(r.ok && r.value.total).toBe(4);
  });

  it("busca por nombre o ciudad sin distinguir acentos ni mayúsculas", async () => {
    const r = await listChapters({ reader: reader(data) }, { query: "  MALAGA " });
    expect(r.ok && r.value.chapters.map((x) => x.slug)).toEqual(["Málaga"]);
  });

  it("filtra por comunidad autónoma", async () => {
    const r = await listChapters({ reader: reader(data) }, { comunidadId: "AN" });
    expect(r.ok && r.value.chapters.map((x) => x.slug)).toEqual(["Málaga", "Sevilla"]);
  });

  it("cuenta capítulos por comunidad sin incluir ocultos, inactivos ni sin región", async () => {
    const r = await listChapters({ reader: reader(data) }, { comunidadId: "AN" });
    expect(r.ok && r.value.comunidades.map((x) => [x.comunidad.id, x.count])).toEqual([
      ["AN", 2],
      ["MD", 1],
    ]);
  });

  it("combina búsqueda y comunidad", async () => {
    const r = await listChapters({ reader: reader(data) }, { query: "sev", comunidadId: "MD" });
    expect(r.ok && r.value.chapters).toEqual([]);
  });
});

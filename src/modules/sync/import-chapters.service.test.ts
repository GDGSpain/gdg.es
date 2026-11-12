/** RF-SYNC-002, RF-SYNC-005: reglas del caso de uso "importar capítulos de España" con fakes de los puertos. */
import { describe, expect, it } from "vitest";
import type { ChapterSourceFields } from "@db/schemas/chapter.schema";
import { err, ok, type Result } from "@/shared/result";
import { importChapters, toSourceFields } from "./import-chapters.service";
import type { ChapterRepositoryPort, StoredChapterRef } from "./ports/chapter-repository.port";
import type { GdgSourcePort, SourceChapter, SourceError } from "./ports/gdg-source.port";

const NOW = new Date("2026-11-12T04:00:00Z");

function chapter(slug: string, overrides: Partial<SourceChapter> = {}): SourceChapter {
  return {
    sourceId: Math.abs([...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)),
    slug,
    title: ` GDG ${slug} `,
    country: "ES",
    city: "Madrid",
    state: "Community of Madrid",
    latitude: 40.4,
    longitude: -3.7,
    logoUrl: null,
    bannerUrl: null,
    descriptionHtml: "<p>Hola</p>",
    website: null,
    twitter: null,
    linkedin: null,
    instagram: null,
    membersCount: 10,
    active: true,
    url: `https://gdg.community.dev/${slug}/`,
    ...overrides,
  };
}

class FakeSource implements GdgSourcePort {
  constructor(private readonly pages: Record<string, Result<SourceChapter, SourceError>>) {}
  requested: string[] = [];
  async getChapter(slug: string) {
    this.requested.push(slug);
    return this.pages[slug] ?? err<SourceError>({ kind: "not-found" });
  }
}

class FakeRepository implements ChapterRepositoryPort {
  upserts: ChapterSourceFields[] = [];
  inactivated: number[] = [];
  constructor(private readonly stored: StoredChapterRef[] = []) {}
  async findAll() {
    return this.stored;
  }
  async upsertFromSource(c: ChapterSourceFields) {
    this.upserts.push(c);
    return this.stored.some((s) => s.sourceId === c.sourceId) ? ("updated" as const) : ("created" as const);
  }
  async markInactive(ids: number[]) {
    this.inactivated.push(...ids);
    return ids.length;
  }
}

const run = (source: GdgSourcePort, repository: ChapterRepositoryPort, seedSlugs: string[]) =>
  importChapters({ source, repository, now: () => NOW }, { seedSlugs });

describe("importChapters", () => {
  it("guarda los capítulos de España de la semilla y cuenta altas y actualizaciones", async () => {
    const madrid = chapter("gdg-madrid");
    const source = new FakeSource({ "gdg-madrid": ok(madrid), "gdg-ourense": ok(chapter("gdg-ourense")) });
    const repo = new FakeRepository([{ sourceId: madrid.sourceId, slug: "gdg-madrid", active: true }]);

    const result = await run(source, repo, ["gdg-madrid", "gdg-ourense"]);

    expect(result).toMatchObject({ ok: true, value: { created: 1, updated: 1, failed: [], inactivated: 0 } });
    expect(repo.upserts.map((c) => c.slug)).toEqual(["gdg-madrid", "gdg-ourense"]);
  });

  it("descarta capítulos que no son de España y no los guarda", async () => {
    const source = new FakeSource({ "gdg-porto": ok(chapter("gdg-porto", { country: "PT" })) });
    const repo = new FakeRepository();

    const result = await run(source, repo, ["gdg-porto"]);

    expect(result).toMatchObject({ ok: true, value: { discarded: ["gdg-porto"], created: 0 } });
    expect(repo.upserts).toEqual([]);
  });

  it("vuelve a visitar los capítulos ya guardados aunque no estén en la semilla", async () => {
    const source = new FakeSource({ "gdg-nuevo": ok(chapter("gdg-nuevo")) });
    const repo = new FakeRepository([{ sourceId: 1, slug: "gdg-nuevo", active: true }]);

    await run(source, repo, []);

    expect(source.requested).toEqual(["gdg-nuevo"]);
  });

  it("marca inactivo un capítulo guardado que la fuente ya no publica", async () => {
    const repo = new FakeRepository([
      { sourceId: 1, slug: "gdg-cerrado", active: true },
      { sourceId: 2, slug: "gdg-vivo", active: true },
    ]);
    const source = new FakeSource({ "gdg-vivo": ok(chapter("gdg-vivo", { sourceId: 2 })) });

    const result = await run(source, repo, []);

    expect(repo.inactivated).toEqual([1]);
    expect(result).toMatchObject({ ok: true, value: { inactivated: 1 } });
  });

  it("marca inactivo un capítulo que la fuente publica como inactivo, sin actualizarlo", async () => {
    const repo = new FakeRepository([{ sourceId: 3, slug: "gdg-dormido", active: true }]);
    const source = new FakeSource({
      "gdg-dormido": ok(chapter("gdg-dormido", { sourceId: 3, active: false })),
    });

    await run(source, repo, []);

    expect(repo.upserts).toEqual([]);
    expect(repo.inactivated).toEqual([3]);
  });

  it("un fallo temporal no marca la baja del capítulo afectado", async () => {
    const repo = new FakeRepository([
      { sourceId: 1, slug: "gdg-a", active: true },
      { sourceId: 2, slug: "gdg-b", active: true },
      { sourceId: 3, slug: "gdg-c", active: true },
    ]);
    const source = new FakeSource({
      "gdg-a": err({ kind: "unavailable", detail: "503" }),
      "gdg-b": ok(chapter("gdg-b", { sourceId: 2 })),
      "gdg-c": ok(chapter("gdg-c", { sourceId: 3 })),
    });

    const result = await run(source, repo, []);

    expect(repo.inactivated).toEqual([]);
    expect(result).toMatchObject({ ok: true, value: { failed: [{ slug: "gdg-a" }] } });
  });

  it("si falla más de la mitad, la ejecución es fallida y no marca bajas", async () => {
    const repo = new FakeRepository([
      { sourceId: 1, slug: "gdg-a", active: true },
      { sourceId: 2, slug: "gdg-b", active: true },
      { sourceId: 3, slug: "gdg-gone", active: true },
    ]);
    const source = new FakeSource({
      "gdg-a": err({ kind: "invalid", detail: "sin __NEXT_DATA__" }),
      "gdg-b": err({ kind: "unavailable", detail: "timeout" }),
    });

    const result = await run(source, repo, []);

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({
      error: { kind: "too-many-failures", report: { inactivationSkipped: true } },
    });
    expect(repo.inactivated).toEqual([]);
  });

  it("exactamente la mitad de fallos todavía permite marcar bajas", async () => {
    const repo = new FakeRepository([
      { sourceId: 1, slug: "gdg-a", active: true },
      { sourceId: 2, slug: "gdg-gone", active: true },
    ]);
    const source = new FakeSource({ "gdg-a": err({ kind: "unavailable", detail: "503" }) });

    const result = await run(source, repo, []);

    expect(result.ok).toBe(true);
    expect(repo.inactivated).toEqual([2]);
  });

  it("una ruta prohibida por robots.txt cuenta como fallo, con el motivo", async () => {
    const source = new FakeSource({ api: err({ kind: "forbidden", path: "/api/" }) });

    const result = await run(source, new FakeRepository(), ["api"]);

    expect(result).toMatchObject({
      error: { report: { failed: [{ slug: "api", reason: expect.stringContaining("robots.txt") }] } },
    });
  });
});

describe("toSourceFields", () => {
  it("normaliza la comunidad, detecta GDG on Campus y recorta espacios", () => {
    const fields = toSourceFields(chapter("gdg-on-campus-ie-university-madrid-spain"));
    expect(fields).toMatchObject({ comunidadId: "MD", sourceState: "Community of Madrid", isCampus: true });
    expect(fields.title).toBe("GDG gdg-on-campus-ie-university-madrid-spain");
  });

  it("deja la comunidad en null si la región no se reconoce", () => {
    expect(toSourceFields(chapter("gdg-x", { state: "Planeta Tierra" })).comunidadId).toBeNull();
  });

  it("no incluye campos propios ni de ocultación", () => {
    const keys = Object.keys(toSourceFields(chapter("gdg-madrid")));
    expect(keys).not.toContain("own");
    expect(keys).not.toContain("hiddenAt");
    expect(keys).not.toContain("active");
  });
});

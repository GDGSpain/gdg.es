/**
 * RF-SYNC-002, RF-SYNC-005: caso de uso "importar capítulos de España".
 *
 * Recorre los slugs conocidos (semilla + ya guardados), lee cada capítulo de la fuente, descarta los
 * que no son de España (AGENTS.md regla 4), guarda el resto con upsert idempotente y marca inactivos
 * los que desaparecen. Si fallan demasiados capítulos, no marca bajas para no ocultar capítulos por
 * un problema temporal de la fuente.
 */
import type { ChapterSourceFields } from "@db/schemas/chapter.schema";
import { normalizarComunidad } from "@/shared/geo/comunidades";
import { err, ok, type Result } from "@/shared/result";
import type { ChapterRepositoryPort } from "./ports/chapter-repository.port";
import type { GdgSourcePort, SourceChapter, SourceError } from "./ports/gdg-source.port";

/** Por encima de esta proporción de fallos la ejecución no marca bajas. */
export const MAX_FAILURE_RATIO = 0.5;

export interface ImportChaptersDeps {
  source: GdgSourcePort;
  repository: ChapterRepositoryPort;
  now: () => Date;
}

export interface ImportChaptersInput {
  /** Slugs de la semilla (`db/seed/chapters-es.json`). */
  seedSlugs: string[];
}

export interface ImportChaptersReport {
  created: number;
  updated: number;
  /** Slugs que no son de España (la fuente dice otro país). */
  discarded: string[];
  /** Slugs que no se pudieron leer, con el motivo. */
  failed: { slug: string; reason: string }[];
  /** Capítulos que pasaron a inactivos en esta ejecución. */
  inactivated: number;
  /** true si no se marcaron bajas por exceso de fallos. */
  inactivationSkipped: boolean;
}

export type ImportChaptersError = { kind: "too-many-failures"; report: ImportChaptersReport };

/**
 * Importa los capítulos de España.
 * @returns el informe; error si fallaron más de la mitad (la ejecución se considera fallida)
 */
export async function importChapters(
  deps: ImportChaptersDeps,
  input: ImportChaptersInput,
): Promise<Result<ImportChaptersReport, ImportChaptersError>> {
  const stored = await deps.repository.findAll();
  const slugs = [...new Set([...input.seedSlugs, ...stored.map((c) => c.slug)])].sort();
  const syncedAt = deps.now();

  const report: ImportChaptersReport = {
    created: 0,
    updated: 0,
    discarded: [],
    failed: [],
    inactivated: 0,
    inactivationSkipped: false,
  };
  const seenActive = new Set<number>();
  const gone = new Set<string>(); // slugs que la fuente ya no publica o no son de España

  for (const slug of slugs) {
    const result = await deps.source.getChapter(slug);
    if (!result.ok) {
      if (result.error.kind === "not-found") {
        gone.add(slug);
      } else {
        report.failed.push({ slug, reason: describe(result.error) });
      }
      continue;
    }
    const chapter = result.value;
    if (chapter.country !== "ES") {
      report.discarded.push(slug);
      gone.add(slug);
      continue;
    }
    if (!chapter.active) {
      gone.add(slug);
      continue;
    }
    const outcome = await deps.repository.upsertFromSource(toSourceFields(chapter), syncedAt);
    report[outcome] += 1;
    seenActive.add(chapter.sourceId);
  }

  const failureRatio = slugs.length === 0 ? 0 : report.failed.length / slugs.length;
  if (failureRatio > MAX_FAILURE_RATIO) {
    report.inactivationSkipped = true;
    return err({ kind: "too-many-failures", report });
  }

  const toInactivate = stored
    .filter((c) => c.active && !seenActive.has(c.sourceId) && gone.has(c.slug))
    .map((c) => c.sourceId);
  if (toInactivate.length > 0) {
    report.inactivated = await deps.repository.markInactive(toInactivate, syncedAt);
  }
  return ok(report);
}

/** Traduce el capítulo de la fuente a los campos de origen que se guardan. */
export function toSourceFields(c: SourceChapter): ChapterSourceFields {
  return {
    sourceId: c.sourceId,
    slug: c.slug,
    title: c.title.trim(),
    city: c.city.trim(),
    sourceState: c.state,
    comunidadId: normalizarComunidad(c.state)?.id ?? null,
    latitude: c.latitude,
    longitude: c.longitude,
    logoUrl: c.logoUrl,
    bannerUrl: c.bannerUrl,
    descriptionHtml: c.descriptionHtml,
    website: c.website,
    twitter: c.twitter,
    linkedin: c.linkedin,
    instagram: c.instagram,
    membersCount: c.membersCount,
    isCampus: c.slug.startsWith("gdg-on-campus-"),
    sourceUrl: c.url,
  };
}

function describe(e: Exclude<SourceError, { kind: "not-found" }>): string {
  switch (e.kind) {
    case "forbidden":
      return `ruta prohibida por robots.txt: ${e.path}`;
    case "unavailable":
      return `fuente no disponible: ${e.detail}`;
    case "invalid":
      return `página con formato inesperado: ${e.detail}`;
  }
}

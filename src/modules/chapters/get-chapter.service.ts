/** RF-CHAPTERS-002, RF-SYNC-003: caso de uso "ficha de capítulo" con su equipo organizador. */
import { err, ok, type Result } from "@/shared/result";
import { isPublic, type ChapterDetail } from "./chapter";
import type { ChapterReaderPort } from "./ports/chapter-reader.port";

export type GetChapterError = { kind: "not-found" };

/**
 * Devuelve un capítulo público por su slug.
 * Del equipo se quitan las personas ocultas (oposición RGPD, RF-ADMIN-003).
 * @returns not-found si no existe, está inactivo u oculto
 */
export async function getChapter(
  deps: { reader: ChapterReaderPort },
  slug: string,
): Promise<Result<ChapterDetail, GetChapterError>> {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return err({ kind: "not-found" });
  const chapter = await deps.reader.findBySlug(slug);
  if (!chapter || !isPublic(chapter)) return err({ kind: "not-found" });
  const team = chapter.team.filter((m) => !m.hidden).sort(byRole);
  return ok({ ...chapter, team });
}

/** Primero quien organiza ("Organizer" en el rol), después el resto; dentro, por nombre. */
function byRole(a: { role: string; name: string }, b: { role: string; name: string }): number {
  const rank = (r: string) => (/organi[sz]er/i.test(r) && !/co-?organi/i.test(r) ? 0 : 1);
  return rank(a.role) - rank(b.role) || a.name.localeCompare(b.name, "es");
}

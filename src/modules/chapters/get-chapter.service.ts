/** RF-CHAPTERS-002: caso de uso "ficha de capítulo". */
import { err, ok, type Result } from "@/shared/result";
import { isPublic, type ChapterDetail } from "./chapter";
import type { ChapterReaderPort } from "./ports/chapter-reader.port";

export type GetChapterError = { kind: "not-found" };

/**
 * Devuelve un capítulo público por su slug.
 * @returns not-found si no existe, está inactivo u oculto
 */
export async function getChapter(
  deps: { reader: ChapterReaderPort },
  slug: string,
): Promise<Result<ChapterDetail, GetChapterError>> {
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return err({ kind: "not-found" });
  const chapter = await deps.reader.findBySlug(slug);
  return chapter && isPublic(chapter) ? ok(chapter) : err({ kind: "not-found" });
}

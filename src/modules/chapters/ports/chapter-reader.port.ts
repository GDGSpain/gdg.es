/** RF-CHAPTERS-001/002: lectura de capítulos para la web pública. Implementación en infrastructure/firestore. */
import type { ChapterDetail, ChapterSummary } from "../chapter";

export interface ChapterReaderPort {
  /** Todos los capítulos guardados (el caso de uso decide cuáles son públicos). */
  listAll(): Promise<ChapterSummary[]>;
  /**
   * Un capítulo por su slug.
   * @returns null si no existe
   */
  findBySlug(slug: string): Promise<ChapterDetail | null>;
}

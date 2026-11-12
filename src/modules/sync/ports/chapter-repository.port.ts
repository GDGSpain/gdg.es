/** RF-SYNC-002: persistencia de capítulos que necesita el sync. Implementación en infrastructure/firestore. */
import type { ChapterSourceFields } from "@db/schemas/chapter.schema";

/** Lo mínimo de un capítulo guardado para decidir altas y bajas. */
export interface StoredChapterRef {
  sourceId: number;
  slug: string;
  active: boolean;
}

export interface ChapterRepositoryPort {
  /** Todos los capítulos guardados (activos e inactivos). */
  findAll(): Promise<StoredChapterRef[]>;

  /**
   * Crea o actualiza los campos de origen de un capítulo y lo marca activo.
   * Nunca modifica `own` ni `hiddenAt`.
   * @returns si el capítulo es nuevo o ya existía
   */
  upsertFromSource(chapter: ChapterSourceFields, syncedAt: Date): Promise<"created" | "updated">;

  /**
   * Marca capítulos como inactivos (se ocultan, no se borran). Los ya inactivos no cambian.
   * @returns cuántos pasaron de activos a inactivos
   */
  markInactive(sourceIds: number[], since: Date): Promise<number>;
}

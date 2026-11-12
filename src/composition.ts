/**
 * Raíz de composición del servidor (ADR-0006): único sitio que conoce a la vez los casos de uso y los
 * adaptadores concretos. RF-SYNC-002: dependencias del sync de capítulos.
 */
import type { ImportChaptersDeps } from "@/modules/sync/import-chapters.service";
import type { AppConfig } from "@/shared/config/config";
import { FirestoreChapterRepository } from "@/infrastructure/firestore/chapter-repository.adapter";
import { getServerFirestore } from "@/infrastructure/firestore/admin";
import { HttpGdgSource } from "@/infrastructure/gdg-source/http-gdg-source.adapter";

/**
 * Dependencias del caso de uso "importar capítulos".
 * @param config configuración validada
 */
export function buildImportChaptersDeps(config: AppConfig): ImportChaptersDeps {
  return {
    source: new HttpGdgSource({
      baseUrl: config.GDG_SOURCE_BASE_URL,
      userAgent: config.SYNC_USER_AGENT,
      minDelayMs: config.SYNC_DELAY_MS,
    }),
    repository: new FirestoreChapterRepository(getServerFirestore(config)),
    now: () => new Date(),
  };
}

/** RF-SYNC-003: persistencia del equipo organizador de cada capítulo. Implementación en infrastructure/firestore. */
import type { SourceTeamMember } from "./gdg-source.port";

export interface OrganizerRepositoryPort {
  /**
   * Deja el equipo de un capítulo exactamente como lo publica la fuente: crea o actualiza a cada
   * persona (una por `profileId`, aunque organice varios capítulos), le asigna su rol en ese capítulo y
   * quita el capítulo a quien ya no está en el equipo. Nunca toca `own` ni `hiddenAt`.
   * @returns cuántas personas quedan en el equipo y cuántas se quitaron
   */
  replaceChapterTeam(
    chapterSourceId: number,
    team: SourceTeamMember[],
    syncedAt: Date,
  ): Promise<{ members: number; removed: number }>;
}

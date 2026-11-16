/**
 * RF-SYNC-003, ADR-0008: equipo organizador sobre Firestore (`organizers/{profileId}`).
 *
 * Cada capítulo se actualiza en una transacción: quien está en el equipo recibe el capítulo y su rol;
 * quien ya no está lo pierde. La misma persona en varios capítulos es un único documento. Si alguien se
 * queda sin capítulos, su documento se borra (no se conservan datos personales sin finalidad, RGPD),
 * salvo que tenga `hiddenAt` (su oposición debe seguir valiendo si vuelve a aparecer) o datos propios.
 */
import { FieldValue, Timestamp, type Firestore } from "firebase-admin/firestore";
import { ORGANIZERS_COLLECTION, organizerSourceFieldsSchema } from "@db/schemas/organizer.schema";
import type { SourceTeamMember } from "@/modules/sync/ports/gdg-source.port";
import type { OrganizerRepositoryPort } from "@/modules/sync/ports/organizer-repository.port";

export class FirestoreOrganizerRepository implements OrganizerRepositoryPort {
  constructor(private readonly db: Firestore) {}

  /** {@inheritDoc OrganizerRepositoryPort.replaceChapterTeam} */
  async replaceChapterTeam(chapterSourceId: number, team: SourceTeamMember[], syncedAt: Date) {
    const collection = this.db.collection(ORGANIZERS_COLLECTION);
    const at = Timestamp.fromDate(syncedAt);
    const key = String(chapterSourceId);
    const members = team.map((m) => ({
      ...organizerSourceFieldsSchema.parse(m),
      role: m.role.slice(0, 100),
    }));
    const keep = new Set(members.map((m) => m.profileId));

    return this.db.runTransaction(async (tx) => {
      // Lecturas primero (requisito de las transacciones de Firestore).
      const current = await tx.get(collection.where("chapterIds", "array-contains", chapterSourceId));
      const refs = members.map((m) => collection.doc(m.profileId));
      const snaps = refs.length ? await tx.getAll(...refs) : [];

      let removed = 0;
      for (const doc of current.docs) {
        if (keep.has(doc.id)) continue;
        const remaining = ((doc.get("chapterIds") as number[] | undefined) ?? []).filter(
          (id) => id !== chapterSourceId,
        );
        const own = doc.get("own") as Record<string, unknown> | undefined;
        if (
          remaining.length === 0 &&
          doc.get("hiddenAt") == null &&
          (!own || Object.keys(own).length === 0)
        ) {
          tx.delete(doc.ref);
          removed++;
          continue;
        }
        tx.update(doc.ref, {
          chapterIds: FieldValue.arrayRemove(chapterSourceId),
          [`roles.${key}`]: FieldValue.delete(),
          syncedAt: at,
        });
        removed++;
      }

      members.forEach((m, i) => {
        const { role, ...fields } = m;
        if (!snaps[i].exists) {
          tx.set(refs[i], {
            ...fields,
            chapterIds: [chapterSourceId],
            roles: { [key]: role },
            hiddenAt: null,
            own: {},
            syncedAt: at,
            createdAt: at,
          });
        } else {
          tx.update(refs[i], {
            ...fields,
            chapterIds: FieldValue.arrayUnion(chapterSourceId),
            [`roles.${key}`]: role,
            syncedAt: at,
          });
        }
      });

      return { members: members.length, removed };
    });
  }
}

/**
 * RF-SYNC-002, ADR-0008: repositorio de capítulos sobre Firestore (`chapters/{sourceId}`).
 *
 * El upsert escribe solo los campos de origen con `merge`, de modo que `own` (datos propios) y
 * `hiddenAt` (ocultación, RF-ADMIN-003) nunca se pisan.
 */
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import {
  CHAPTERS_COLLECTION,
  chapterSourceFieldsSchema,
  type ChapterSourceFields,
} from "@db/schemas/chapter.schema";
import type { ChapterRepositoryPort, StoredChapterRef } from "@/modules/sync/ports/chapter-repository.port";

export class FirestoreChapterRepository implements ChapterRepositoryPort {
  constructor(private readonly db: Firestore) {}

  private get collection() {
    return this.db.collection(CHAPTERS_COLLECTION);
  }

  /** {@inheritDoc ChapterRepositoryPort.findAll} */
  async findAll(): Promise<StoredChapterRef[]> {
    const snap = await this.collection.select("sourceId", "slug", "active").get();
    return snap.docs.map((d) => ({
      sourceId: Number(d.get("sourceId")),
      slug: String(d.get("slug")),
      active: Boolean(d.get("active")),
    }));
  }

  /** {@inheritDoc ChapterRepositoryPort.upsertFromSource} */
  async upsertFromSource(chapter: ChapterSourceFields, syncedAt: Date): Promise<"created" | "updated"> {
    const fields = chapterSourceFieldsSchema.parse(chapter);
    const ref = this.collection.doc(String(fields.sourceId));
    const at = Timestamp.fromDate(syncedAt);
    return this.db.runTransaction(async (tx) => {
      const current = await tx.get(ref);
      if (!current.exists) {
        tx.set(ref, {
          ...fields,
          active: true,
          inactiveSince: null,
          hiddenAt: null,
          own: {},
          syncedAt: at,
          createdAt: at,
        });
        return "created" as const;
      }
      tx.set(ref, { ...fields, active: true, inactiveSince: null, syncedAt: at }, { merge: true });
      return "updated" as const;
    });
  }

  /** {@inheritDoc ChapterRepositoryPort.markInactive} */
  async markInactive(sourceIds: number[], since: Date): Promise<number> {
    let changed = 0;
    for (let i = 0; i < sourceIds.length; i += 400) {
      const refs = sourceIds.slice(i, i + 400).map((id) => this.collection.doc(String(id)));
      const snaps = await this.db.getAll(...refs);
      const batch = this.db.batch();
      for (const s of snaps) {
        if (s.exists && s.get("active") === true) {
          batch.update(s.ref, { active: false, inactiveSince: Timestamp.fromDate(since) });
          changed++;
        }
      }
      await batch.commit();
    }
    return changed;
  }
}

/** RF-CHAPTERS-001/002, ADR-0008: lectura de `chapters` para la web pública. */
import type { DocumentData, Firestore, Timestamp } from "firebase-admin/firestore";
import { CHAPTERS_COLLECTION } from "@db/schemas/chapter.schema";
import type { ChapterDetail, ChapterSummary } from "@/modules/chapters/chapter";
import type { ChapterReaderPort } from "@/modules/chapters/ports/chapter-reader.port";

const str = (v: unknown): string | null => (typeof v === "string" && v !== "" ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

function toSummary(d: DocumentData): ChapterSummary {
  return {
    sourceId: Number(d.sourceId),
    slug: String(d.slug),
    title: String(d.title),
    city: String(d.city ?? ""),
    comunidadId: str(d.comunidadId),
    logoUrl: str(d.logoUrl),
    isCampus: Boolean(d.isCampus),
    membersCount: num(d.membersCount),
    active: d.active === true,
    hidden: d.hiddenAt != null,
  };
}

function toDetail(d: DocumentData): ChapterDetail {
  return {
    ...toSummary(d),
    latitude: num(d.latitude),
    longitude: num(d.longitude),
    bannerUrl: str(d.bannerUrl),
    descriptionHtml: String(d.descriptionHtml ?? ""),
    website: str(d.website),
    twitter: str(d.twitter),
    linkedin: str(d.linkedin),
    instagram: str(d.instagram),
    sourceUrl: String(d.sourceUrl),
    syncedAt: (d.syncedAt as Timestamp | undefined)?.toDate?.() ?? new Date(0),
  };
}

export class FirestoreChapterReader implements ChapterReaderPort {
  constructor(private readonly db: Firestore) {}

  /** {@inheritDoc ChapterReaderPort.listAll} */
  async listAll(): Promise<ChapterSummary[]> {
    const snap = await this.db
      .collection(CHAPTERS_COLLECTION)
      .select(
        "sourceId",
        "slug",
        "title",
        "city",
        "comunidadId",
        "logoUrl",
        "isCampus",
        "membersCount",
        "active",
        "hiddenAt",
      )
      .get();
    return snap.docs.map((doc) => toSummary(doc.data()));
  }

  /** {@inheritDoc ChapterReaderPort.findBySlug} */
  async findBySlug(slug: string): Promise<ChapterDetail | null> {
    const snap = await this.db.collection(CHAPTERS_COLLECTION).where("slug", "==", slug).limit(1).get();
    return snap.empty ? null : toDetail(snap.docs[0].data());
  }
}

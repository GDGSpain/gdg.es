/** RF-CHAPTERS-001/002, RF-SYNC-003, ADR-0008: lectura de capítulos y su equipo para la web pública. */
import type { DocumentData, Firestore, Timestamp } from "firebase-admin/firestore";
import { CHAPTERS_COLLECTION } from "@db/schemas/chapter.schema";
import { ORGANIZERS_COLLECTION } from "@db/schemas/organizer.schema";
import type { ChapterDetail, ChapterSummary, TeamMember } from "@/modules/chapters/chapter";
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

function toDetail(d: DocumentData, team: TeamMember[]): ChapterDetail {
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
    team,
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
    if (snap.empty) return null;
    const data = snap.docs[0].data();
    return toDetail(data, await this.listTeam(Number(data.sourceId)));
  }

  private async listTeam(chapterSourceId: number): Promise<TeamMember[]> {
    const snap = await this.db
      .collection(ORGANIZERS_COLLECTION)
      .where("chapterIds", "array-contains", chapterSourceId)
      .get();
    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        profileId: doc.id,
        name: String(d.name),
        avatarUrl: str(d.avatarUrl),
        twitter: str(d.twitter),
        role: String(d.roles?.[String(chapterSourceId)] ?? "Organizer"),
        hidden: d.hiddenAt != null,
      };
    });
  }
}

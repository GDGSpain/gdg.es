/** RF-CHAPTERS-001/002: capítulo tal como lo ve la web pública. */

/** Datos para la lista del directorio. */
export interface ChapterSummary {
  sourceId: number;
  slug: string;
  title: string;
  city: string;
  comunidadId: string | null;
  logoUrl: string | null;
  isCampus: boolean;
  membersCount: number | null;
  active: boolean;
  hidden: boolean;
}

/** Persona del equipo organizador tal como se muestra en la ficha (RF-SYNC-003). */
export interface TeamMember {
  profileId: string;
  name: string;
  avatarUrl: string | null;
  twitter: string | null;
  role: string;
  hidden: boolean;
}

/** Datos de la ficha. */
export interface ChapterDetail extends ChapterSummary {
  latitude: number | null;
  longitude: number | null;
  bannerUrl: string | null;
  descriptionHtml: string;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  sourceUrl: string;
  syncedAt: Date;
  team: TeamMember[];
}

/** Un capítulo es público si está activo en la fuente y nadie lo ha ocultado (RF-ADMIN-003). */
export function isPublic(c: Pick<ChapterSummary, "active" | "hidden">): boolean {
  return c.active && !c.hidden;
}

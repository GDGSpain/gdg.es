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
}

/** Un capítulo es público si está activo en la fuente y nadie lo ha ocultado (RF-ADMIN-003). */
export function isPublic(c: Pick<ChapterSummary, "active" | "hidden">): boolean {
  return c.active && !c.hidden;
}

/**
 * RF-SYNC-002, RF-CHAPTERS-001/002: documento `chapters/{sourceId}` de Firestore (ADR-0008).
 *
 * Fuente de la verdad del modelo de capítulo. Los campos de origen los escribe el sync en cada
 * ejecución; `own` (datos propios) y `hiddenAt` (ocultación, RF-ADMIN-003) nunca los toca el sync.
 */
import { z } from "zod";

/** Campos que vienen de gdg.community.dev y el sync sobrescribe. */
export const chapterSourceFieldsSchema = z.object({
  sourceId: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  city: z.string(),
  /** Región tal cual la da la fuente (sin normalizar: "Andalusia", "AN"…). */
  sourceState: z.string(),
  /** Comunidad autónoma normalizada (`src/shared/geo/comunidades.ts`); null si no se reconoce. */
  comunidadId: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  logoUrl: z.url().nullable(),
  bannerUrl: z.url().nullable(),
  /** HTML de la fuente: se sanea al renderizar, nunca se inserta tal cual. */
  descriptionHtml: z.string(),
  website: z.url().nullable(),
  twitter: z.string().nullable(),
  linkedin: z.url().nullable(),
  instagram: z.string().nullable(),
  membersCount: z.number().int().nonnegative().nullable(),
  isCampus: z.boolean(),
  sourceUrl: z.url(),
});

export type ChapterSourceFields = z.infer<typeof chapterSourceFieldsSchema>;

/** Documento completo tal como se guarda. */
export const chapterDocSchema = chapterSourceFieldsSchema.extend({
  active: z.boolean(),
  inactiveSince: z.date().nullable(),
  hiddenAt: z.date().nullable(),
  syncedAt: z.date(),
  createdAt: z.date(),
  own: z.record(z.string(), z.unknown()).default({}),
});

export type ChapterDoc = z.infer<typeof chapterDocSchema>;

/** Nombre de la colección. */
export const CHAPTERS_COLLECTION = "chapters";

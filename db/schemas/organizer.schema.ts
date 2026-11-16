/**
 * RF-SYNC-003, RF-ORGANIZERS-001: documento `organizers/{profileId}` de Firestore (ADR-0008).
 *
 * Una persona = un documento, aunque organice varios capítulos (deduplicación por el id de perfil de
 * gdg.community.dev). Solo datos públicos y mínimos (AGENTS.md regla 8, docs/legal). `own` y
 * `hiddenAt` (oposición RGPD, RF-ADMIN-003) nunca los toca el sync.
 */
import { z } from "zod";

export const organizerSourceFieldsSchema = z.object({
  profileId: z.string().regex(/^[a-z0-9]+$/),
  name: z.string().min(1).max(200),
  avatarUrl: z.url().nullable(),
  twitter: z.string().max(100).nullable(),
});

export type OrganizerSourceFields = z.infer<typeof organizerSourceFieldsSchema>;

export const organizerDocSchema = organizerSourceFieldsSchema.extend({
  /** sourceId de los capítulos que organiza. */
  chapterIds: z.array(z.number().int().positive()),
  /** Rol por capítulo: `{ "975": "GDG Organizer" }`. */
  roles: z.record(z.string(), z.string()),
  hiddenAt: z.date().nullable(),
  syncedAt: z.date(),
  createdAt: z.date(),
  own: z.record(z.string(), z.unknown()).default({}),
});

export type OrganizerDoc = z.infer<typeof organizerDocSchema>;

export const ORGANIZERS_COLLECTION = "organizers";

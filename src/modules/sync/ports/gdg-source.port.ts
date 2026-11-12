/**
 * RF-SYNC-001, RF-SYNC-002: lo que el sync necesita de gdg.community.dev, en lenguaje de dominio.
 * La implementación (páginas públicas y sitemaps, nunca /api/) está en infrastructure/gdg-source
 * (ADR-0005).
 */
import type { Result } from "@/shared/result";

/** Capítulo tal como lo publica la fuente, ya validado. */
export interface SourceChapter {
  sourceId: number;
  slug: string;
  title: string;
  /** Código de país ISO 3166-1 (España = "ES"). */
  country: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  descriptionHtml: string;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  membersCount: number | null;
  /** Activo y visible en la fuente. */
  active: boolean;
  url: string;
}

/** Por qué no se pudo leer un capítulo. */
export type SourceError =
  | { kind: "not-found" } // la página no existe (posible baja)
  | { kind: "forbidden"; path: string } // robots.txt no lo permite: nunca se pide
  | { kind: "unavailable"; detail: string } // red, 5xx, timeout
  | { kind: "invalid"; detail: string }; // la página cambió de forma

export interface GdgSourcePort {
  /**
   * Lee la página pública de un capítulo.
   * @param slug identificador en la URL (p. ej. "gdg-madrid")
   */
  getChapter(slug: string): Promise<Result<SourceChapter, SourceError>>;
}

/**
 * RF-CHAPTERS-001: caso de uso "directorio de capítulos".
 * Devuelve los capítulos públicos ordenados, filtrados por texto (nombre o ciudad) y comunidad autónoma,
 * y el recuento por comunidad para el filtro.
 */
import { comunidadPorId, type Comunidad } from "@/shared/geo/comunidades";
import { ok, type Result } from "@/shared/result";
import { isPublic, type ChapterSummary } from "./chapter";
import type { ChapterReaderPort } from "./ports/chapter-reader.port";

export interface ListChaptersInput {
  /** Texto libre: nombre o ciudad, sin distinguir mayúsculas ni acentos. */
  query?: string;
  /** Id de comunidad (ISO 3166-2:ES sin prefijo). */
  comunidadId?: string;
}

export interface ListChaptersOutput {
  chapters: ChapterSummary[];
  /** Total de capítulos públicos (sin filtros). */
  total: number;
  /** Comunidades con capítulos públicos y cuántos tiene cada una, ordenadas por nombre. */
  comunidades: { comunidad: Comunidad; count: number }[];
}

/** Minúsculas y sin acentos, para comparar. */
export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Lista el directorio de capítulos.
 * @param deps lector de capítulos
 * @param input filtros opcionales
 */
export async function listChapters(
  deps: { reader: ChapterReaderPort },
  input: ListChaptersInput = {},
): Promise<Result<ListChaptersOutput, never>> {
  const all = (await deps.reader.listAll()).filter(isPublic);

  const counts = new Map<string, number>();
  for (const c of all) if (c.comunidadId) counts.set(c.comunidadId, (counts.get(c.comunidadId) ?? 0) + 1);
  const comunidades = [...counts.entries()]
    .map(([id, count]) => ({ comunidad: comunidadPorId(id), count }))
    .filter((x): x is { comunidad: Comunidad; count: number } => x.comunidad !== null)
    .sort((a, b) => a.comunidad.nombre.localeCompare(b.comunidad.nombre, "es"));

  const q = normalizeText(input.query ?? "");
  const chapters = all
    .filter((c) => !input.comunidadId || c.comunidadId === input.comunidadId)
    .filter((c) => !q || normalizeText(c.title).includes(q) || normalizeText(c.city).includes(q))
    .sort((a, b) => a.title.localeCompare(b.title, "es"));

  return ok({ chapters, total: all.length, comunidades });
}

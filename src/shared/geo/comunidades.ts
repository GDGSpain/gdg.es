/**
 * RF-SYNC-002, RF-CHAPTERS-001: comunidades y ciudades autónomas de España y normalización de la región
 * que da gdg.community.dev, que mezcla nombres en inglés, códigos ISO 3166-2:ES y variantes
 * ("Andalusia", "AN", "Community of Madrid"…). Ver docs/tech/sync.md.
 */

/** Comunidad o ciudad autónoma. `id` es el código ISO 3166-2:ES sin prefijo. */
export interface Comunidad {
  id: string;
  nombre: string;
}

export const COMUNIDADES: readonly Comunidad[] = [
  { id: "AN", nombre: "Andalucía" },
  { id: "AR", nombre: "Aragón" },
  { id: "AS", nombre: "Principado de Asturias" },
  { id: "IB", nombre: "Illes Balears" },
  { id: "CN", nombre: "Canarias" },
  { id: "CB", nombre: "Cantabria" },
  { id: "CL", nombre: "Castilla y León" },
  { id: "CM", nombre: "Castilla-La Mancha" },
  { id: "CT", nombre: "Cataluña" },
  { id: "VC", nombre: "Comunitat Valenciana" },
  { id: "EX", nombre: "Extremadura" },
  { id: "GA", nombre: "Galicia" },
  { id: "MD", nombre: "Comunidad de Madrid" },
  { id: "MC", nombre: "Región de Murcia" },
  { id: "NC", nombre: "Comunidad Foral de Navarra" },
  { id: "PV", nombre: "País Vasco" },
  { id: "RI", nombre: "La Rioja" },
  { id: "CE", nombre: "Ceuta" },
  { id: "ML", nombre: "Melilla" },
];

/** Alias (ya normalizados con `clave`) → id de comunidad. */
const ALIAS: Record<string, string> = {
  andalucia: "AN",
  andalusia: "AN",
  aragon: "AR",
  asturias: "AS",
  "principado de asturias": "AS",
  "illes balears": "IB",
  "islas baleares": "IB",
  "balearic islands": "IB",
  baleares: "IB",
  canarias: "CN",
  "canary islands": "CN",
  "islas canarias": "CN",
  cantabria: "CB",
  "castilla y leon": "CL",
  "castille and leon": "CL",
  "castile and leon": "CL",
  "castilla-la mancha": "CM",
  "castilla la mancha": "CM",
  "castille-la mancha": "CM",
  "castile-la mancha": "CM",
  cataluna: "CT",
  catalunya: "CT",
  catalonia: "CT",
  "comunitat valenciana": "VC",
  "comunidad valenciana": "VC",
  valencia: "VC",
  "valencian community": "VC",
  extremadura: "EX",
  galicia: "GA",
  madrid: "MD",
  "comunidad de madrid": "MD",
  "community of madrid": "MD",
  murcia: "MC",
  "region de murcia": "MC",
  "region of murcia": "MC",
  navarra: "NC",
  "comunidad foral de navarra": "NC",
  navarre: "NC",
  "pais vasco": "PV",
  euskadi: "PV",
  "basque country": "PV",
  "la rioja": "RI",
  rioja: "RI",
  ceuta: "CE",
  melilla: "ML",
};

const BY_ID = new Map(COMUNIDADES.map((c) => [c.id, c]));

/** Minúsculas, sin acentos ni espacios repetidos. */
function clave(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Normaliza la región de la fuente a una comunidad autónoma.
 * @param state región tal cual la da gdg.community.dev (nombre, alias o código ISO)
 * @returns la comunidad, o null si no se reconoce
 */
export function normalizarComunidad(state: string | null | undefined): Comunidad | null {
  if (!state) return null;
  const k = clave(state);
  const codigo = k.toUpperCase();
  if (k.length === 2 && BY_ID.has(codigo)) return BY_ID.get(codigo)!;
  const id = ALIAS[k];
  return id ? BY_ID.get(id)! : null;
}

/**
 * Busca una comunidad por su id.
 * @param id código ISO 3166-2:ES sin prefijo (p. ej. "MD")
 */
export function comunidadPorId(id: string): Comunidad | null {
  return BY_ID.get(id) ?? null;
}

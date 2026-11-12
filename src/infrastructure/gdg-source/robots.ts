/**
 * RF-SYNC-001, ADR-0005: reglas de robots.txt de la fuente. El cliente las comprueba antes de cada
 * petición para no pedir nunca rutas prohibidas (`/api/`, `/u/`…).
 */

export interface RobotsRules {
  disallow: string[];
  /** Crawl-delay en segundos (0 si no hay). */
  crawlDelaySeconds: number;
}

/** Reglas mínimas conocidas si robots.txt no se puede descargar (copia de 2026-11-12). */
export const FALLBACK_RULES: RobotsRules = {
  disallow: [
    "/health/",
    "/accounts/",
    "/api/",
    "/newsletter/",
    "/gql/",
    "/triggers/",
    "/u/",
    "/viewserver-health/",
  ],
  crawlDelaySeconds: 2,
};

/**
 * Interpreta robots.txt para el grupo `User-agent: *` (nuestro agente no tiene grupo propio).
 * @param text contenido de robots.txt
 */
export function parseRobots(text: string): RobotsRules {
  const rules: RobotsRules = { disallow: [], crawlDelaySeconds: 0 };
  let inStarGroup = false;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === "user-agent") {
      inStarGroup = lastWasAgent ? inStarGroup || value === "*" : value === "*";
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!inStarGroup) continue;
    if (field === "disallow" && value) rules.disallow.push(value);
    if (field === "crawl-delay") {
      const n = Number(value);
      if (Number.isFinite(n) && n > rules.crawlDelaySeconds) rules.crawlDelaySeconds = n;
    }
  }
  return rules;
}

/**
 * ¿Se puede pedir esta ruta?
 * @param path ruta absoluta (p. ej. "/gdg-madrid/")
 */
export function isAllowed(path: string, rules: RobotsRules): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return !rules.disallow.some((prefix) => normalized.startsWith(prefix));
}

/**
 * Configuración de la app validada con zod (AGENTS.md regla 6, fail-fast).
 * Es el único módulo que lee `process.env`; el resto recibe la config ya validada.
 */
import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

/** Variables de entorno que entiende la app. Las `NEXT_PUBLIC_*` son públicas por diseño. */
export const configSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  FIREBASE_PROJECT_ID: optionalString,
  FIREBASE_CLIENT_EMAIL: optionalString,
  FIREBASE_PRIVATE_KEY: optionalString,
  GOOGLE_GEOCODING_API_KEY: optionalString,
  SYNC_USER_AGENT: z.string().trim().min(1).default("gdg.es-directory"),
  /** Base de la fuente (ADR-0005); solo se cambia en tests. */
  GDG_SOURCE_BASE_URL: z.url().default("https://gdg.community.dev"),
  /** Pausa mínima entre peticiones a la fuente; nunca por debajo del Crawl-delay de su robots.txt. */
  SYNC_DELAY_MS: z.coerce.number().int().min(2000).default(2000),
  /** Si está definida, el Admin SDK usa el emulador de Firestore (lo lee el propio SDK). */
  FIRESTORE_EMULATOR_HOST: optionalString,
  SYNC_SECRET: optionalString,
  ADMIN_EMAILS: z
    .string()
    .default("")
    .transform((v) =>
      v
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    )
    .pipe(z.array(z.email())),
});

/** Configuración validada. */
export type AppConfig = z.infer<typeof configSchema>;

/**
 * Valida un conjunto de variables de entorno.
 * @param env variables (normalmente `process.env`)
 * @returns la configuración tipada
 * @throws Error con la lista de variables inválidas, para que la app no arranque mal configurada
 */
export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  const parsed = configSchema.safeParse(env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Configuración inválida: ${fields}`);
  }
  if (parsed.data.NODE_ENV === "production") {
    const missing = (
      ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"] as const
    ).filter((k) => !parsed.data[k]);
    if (missing.length > 0) {
      throw new Error(`Configuración inválida: faltan ${missing.join(", ")} en producción`);
    }
  }
  return parsed.data;
}

let cached: AppConfig | undefined;

/** Devuelve la configuración del proceso, validada una sola vez y de forma perezosa (no en el build). */
export function getConfig(): AppConfig {
  cached ??= loadConfig(process.env);
  return cached;
}

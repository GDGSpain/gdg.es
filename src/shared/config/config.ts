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
  /**
   * Base de datos de Firestore en modo nativo. "(default)" salvo que la del proyecto esté en modo
   * Datastore (como en gdg-es-develop): entonces se usa una base con nombre (docs/tech/firebase.md).
   */
  FIRESTORE_DATABASE_ID: z.string().trim().min(1).default("(default)"),
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
  // En Google Cloud (App Hosting, Cloud Run) el proyecto viene en GOOGLE_CLOUD_PROJECT: así DEV y PRO
  // usan siempre su propio proyecto sin configurarlo a mano.
  const parsed = configSchema.safeParse({
    ...env,
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID || env.GOOGLE_CLOUD_PROJECT || env.GCLOUD_PROJECT,
  });
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Configuración inválida: ${fields}`);
  }
  // En App Hosting el Admin SDK usa la cuenta de ejecución (ADC): no hacen falta claves, solo el proyecto.
  if (
    parsed.data.NODE_ENV === "production" &&
    !parsed.data.FIREBASE_PROJECT_ID &&
    !parsed.data.FIRESTORE_EMULATOR_HOST
  ) {
    throw new Error("Configuración inválida: falta FIREBASE_PROJECT_ID en producción");
  }
  if (Boolean(parsed.data.FIREBASE_CLIENT_EMAIL) !== Boolean(parsed.data.FIREBASE_PRIVATE_KEY)) {
    throw new Error("Configuración inválida: FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY van juntas");
  }
  return parsed.data;
}

let cached: AppConfig | undefined;

/** Devuelve la configuración del proceso, validada una sola vez y de forma perezosa (no en el build). */
export function getConfig(): AppConfig {
  cached ??= loadConfig(process.env);
  return cached;
}

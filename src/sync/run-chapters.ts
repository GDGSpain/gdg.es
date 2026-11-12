/**
 * RF-SYNC-002: comando `npm run sync` — importa los capítulos de España de gdg.community.dev.
 *
 * Usa `.env.local`: con `FIRESTORE_EMULATOR_HOST` escribe en el emulador; sin él, en el proyecto de
 * `FIREBASE_PROJECT_ID` (DEV). Nunca contra PRO (AGENTS.md regla 9).
 */
import { createConnection } from "node:net";
import seed from "@db/seed/chapters-es.json";
import { buildImportChaptersDeps } from "@/composition";
import { importChapters } from "@/modules/sync/import-chapters.service";
import { getConfig } from "@/shared/config/config";

/** ¿Responde algo en host:puerto? Comprobación previa para dar un error claro si el emulador no está arrancado. */
function canConnect(hostPort: string, timeoutMs = 1500): Promise<boolean> {
  const [host, port] = [
    hostPort.slice(0, hostPort.lastIndexOf(":")),
    Number(hostPort.slice(hostPort.lastIndexOf(":") + 1)),
  ];
  return new Promise((resolve) => {
    const socket = createConnection({ host, port });
    const done = (ok: boolean) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs, () => done(false));
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });
}

async function main(): Promise<number> {
  const config = getConfig();
  if (config.FIREBASE_PROJECT_ID === "gdg-es" && !config.FIRESTORE_EMULATOR_HOST) {
    console.error("✖ Este comando no se ejecuta contra PRO (gdg-es). Usa DEV o el emulador.");
    return 2;
  }
  const target = config.FIRESTORE_EMULATOR_HOST
    ? `emulador (${config.FIRESTORE_EMULATOR_HOST})`
    : `proyecto ${config.FIREBASE_PROJECT_ID}`;
  if (config.FIRESTORE_EMULATOR_HOST && !(await canConnect(config.FIRESTORE_EMULATOR_HOST))) {
    console.error(`✖ No hay ningún emulador de Firestore en ${config.FIRESTORE_EMULATOR_HOST}.`);
    console.error("  Arráncalo en otra terminal con `npm run emulators` (necesita Java 21) y espera a ver");
    console.error(
      '  "All emulators ready". Para escribir en DEV, comenta FIRESTORE_EMULATOR_HOST en .env.local.',
    );
    return 2;
  }
  const slugs = seed.chapters.map((c) => c.slug);
  console.log(`Importando ${slugs.length} capítulos de la semilla en ${target}…`);
  console.log(
    `(pausa de ${config.SYNC_DELAY_MS / 1000} s entre peticiones: tardará unos ${Math.ceil((slugs.length * config.SYNC_DELAY_MS) / 60000)} min)`,
  );

  const result = await importChapters(buildImportChaptersDeps(config), { seedSlugs: slugs });
  const report = result.ok ? result.value : result.error.report;

  console.log(`✔ Altas: ${report.created} · Actualizados: ${report.updated} · Bajas: ${report.inactivated}`);
  if (report.discarded.length)
    console.log(`  Descartados (no son de España): ${report.discarded.join(", ")}`);
  for (const f of report.failed) console.log(`  ✖ ${f.slug}: ${f.reason}`);
  if (!result.ok) {
    console.error(
      "✖ Ejecución fallida: más de la mitad de los capítulos no se pudieron leer; no se marcaron bajas.",
    );
    return 1;
  }
  return 0;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    console.error("✖ Error inesperado:", e instanceof Error ? e.message : e);
    process.exit(1);
  },
);

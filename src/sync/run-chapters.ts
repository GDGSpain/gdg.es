/**
 * RF-SYNC-002: comando `npm run sync` — importa los capítulos de España de gdg.community.dev.
 *
 * Usa `.env.local`: con `FIRESTORE_EMULATOR_HOST` escribe en el emulador; sin él, en el proyecto de
 * `FIREBASE_PROJECT_ID` (DEV). Nunca contra PRO (AGENTS.md regla 9).
 */
import seed from "@db/seed/chapters-es.json";
import { buildImportChaptersDeps } from "@/composition";
import { importChapters } from "@/modules/sync/import-chapters.service";
import { getConfig } from "@/shared/config/config";

async function main(): Promise<number> {
  const config = getConfig();
  if (config.FIREBASE_PROJECT_ID === "gdg-es" && !config.FIRESTORE_EMULATOR_HOST) {
    console.error("✖ Este comando no se ejecuta contra PRO (gdg-es). Usa DEV o el emulador.");
    return 2;
  }
  const target = config.FIRESTORE_EMULATOR_HOST
    ? `emulador (${config.FIRESTORE_EMULATOR_HOST})`
    : `proyecto ${config.FIREBASE_PROJECT_ID}`;
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

/**
 * Conventional Commits (hook commit-msg de lefthook).
 *
 *   <tipo>(<ámbito>): <resumen en minúscula, sin punto final>
 *
 * Ámbitos: dominio del RF (sync, chapters, organizers, events, map, sponsors, auth, admin) o área
 * (web, db, ci, docs, deps, legacy, design). Ejemplo: feat(sync): importar capítulos de España (RF-SYNC-002)
 */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "subject-case": [0],
    "scope-enum": [
      1,
      "always",
      [
        "sync",
        "chapters",
        "organizers",
        "events",
        "map",
        "sponsors",
        "auth",
        "admin",
        "web",
        "db",
        "ci",
        "docs",
        "deps",
        "legacy",
        "design",
      ],
    ],
  },
};

export default config;

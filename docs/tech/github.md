# GitHub: ramas, protección y CI

## Ramas

| Rama | Para qué | Despliegue (ADR-0011) |
|---|---|---|
| `develop` | Integración, rama por defecto | `gdg-es-develop` (staging) |
| `master` | Producción | `gdg-es` |
| `feat/…`, `fix/…`, `docs/…` | Trabajo, siempre desde `develop` | — |

## Protección de ramas (Settings → Rules → Rulesets)

Un ruleset para `develop` y `master` con:

- [ ] Require a pull request before merging (1 aprobación; CODEOWNERS como revisores).
- [ ] Require status checks to pass: `Lint, tipos y tests`, `Build`, `Dependencias` y, en PR,
      `Commits (Conventional Commits)` (nombres de los jobs de `.github/workflows/ci.yml`).
- [ ] Require branches to be up to date before merging.
- [ ] Block force pushes y restrict deletions.
- [ ] Sin bypass salvo administradores, para emergencias.

## CODEOWNERS

`.github/CODEOWNERS` asigna `@reiaguilera` como revisor de todo el repositorio.

## Environments y despliegue

Environments `dev` (ahora) y `production` (al final, con aprobación obligatoria y solo desde `master`).
Autenticación con Workload Identity Federation: sin secretos en GitHub, solo identificadores. Detalle en
[`deploy.md`](deploy.md). El `FIREBASE_TOKEN` que usaba el workflow anterior está obsoleto y se borra de
los secretos del repo.

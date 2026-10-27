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

## Secretos de Actions (cuando se despliegue)

Se definen con ADR-0011. Preferir Workload Identity Federation (sin claves JSON) frente a
`FIREBASE_TOKEN`, que es el método que usaba el workflow anterior y está obsoleto.

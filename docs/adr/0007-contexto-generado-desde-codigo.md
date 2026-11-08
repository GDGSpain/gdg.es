# ADR-0007: `docs/context/` se genera desde el código y se comprueba en CI

- **Estado**: Aceptada
- **Fecha**: 2026-10-27

## Contexto

Un agente (o una persona) necesita saber qué tablas y rutas existen sin leer todo el código, y la
documentación escrita a mano se queda vieja.

## Decisión

`data-model.md` (desde los esquemas de colecciones de `db/`) y `api.md` (desde los route handlers y sus esquemas zod) se
generan con `npm run context`. El pre-commit los regenera y el CI falla si no coinciden. `glossary.md`
es manual.

## Consecuencias

- Contexto fiable y barato para los agentes.
- Coste: mantener el script generador.

# ADR-0001: Registrar las decisiones de arquitectura como ADR

- **Estado**: Aceptada
- **Fecha**: 2026-10-27

## Contexto

El proyecto lo desarrolla una sola persona con ayuda de agentes de código. Sin las decisiones escritas,
un agente no distingue una decisión firme de una costumbre y tiende a "mejorar" algo que se descartó a
propósito. El TFM además exige justificar las decisiones.

## Decisión

Cada decisión que condiciona el diseño se registra en `docs/adr/NNNN-titulo.md` con el formato de
Michael Nygard. `AGENTS.md` y la skill `architecture` enlazan aquí para el *porqué*.

## Alternativas descartadas

- **Solo en la skill `architecture`**: es específica de Claude Code y no recoge alternativas.
- **Wiki externa**: se desincroniza del código.

## Consecuencias

- Contradecir un ADR exige escribir otro que lo reemplace: la discusión queda registrada.
- Coste: mantener el índice.

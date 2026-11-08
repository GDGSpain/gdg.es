# ADR-0006: Casos de uso con puertos y `Result<T,E>` dentro de Next.js

- **Estado**: Aceptada
- **Fecha**: 2026-10-27

## Contexto

Next.js invita a meter consultas a la BD directamente en componentes de servidor. Eso hace difícil
testear las reglas (filtro España, deduplicado, permisos) y acopla el producto al SDK de la base de datos y a la fuente.

## Decisión

`src/app/` solo traduce HTTP/render ↔ caso de uso. Los casos de uso viven en
`src/modules/<dominio>/`, reciben sus puertos por parámetro y devuelven `Result<T,E>` (no lanzan para
flujo de negocio). Los adaptadores (base de datos, fuente GDG, auth) están en `src/infrastructure/`. La regla de
dependencias se impone con ESLint (`no-restricted-imports`).

## Alternativas descartadas

- **Consultas en componentes**: rápido al principio, intestable después.
- **Express separado con Clean Architecture completa**: ver ADR-0002.

## Consecuencias

- Casos de uso testeables con fakes en milisegundos.
- Algo más de código por funcionalidad.

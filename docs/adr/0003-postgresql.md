# ADR-0003: PostgreSQL como base de datos; ORM por decidir

- **Estado**: Reemplazada por ADR-0008 (no llegó a aceptarse)
- **Fecha**: 2026-10-27

## Contexto

Datos relacionales (capítulo ↔ organizador N:M, capítulo ↔ evento, sponsor ↔ capítulo/evento) y
consultas geográficas para el mapa.

## Decisión

PostgreSQL (con PostGIS si el mapa lo necesita). Pendiente: **Drizzle** vs **Prisma** y proveedor
(Supabase, Neon o autoalojado).

## Alternativas descartadas

- **NoSQL**: las relaciones N:M son el núcleo del producto.

## Consecuencias

- Migraciones versionadas en `db/` como fuente de la verdad del modelo.

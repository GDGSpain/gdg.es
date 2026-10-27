# ADR-0008: Cloud Firestore como base de datos, accedida solo desde el servidor

- **Estado**: Aceptada
- **Fecha**: 2026-10-27
- **Reemplaza**: ADR-0003

## Contexto

El autor dispone de un proyecto de Firebase/GCP y quiere usar Firebase como base de datos. El volumen es
pequeño (decenas de capítulos, cientos de organizadores y eventos) y las lecturas dominan sobre las
escrituras (solo escribe el sync y el panel). El proyecto también usa Firebase Authentication (ADR-0009).

## Decisión

- **Cloud Firestore** (modo nativo) como única base de datos, en región europea
  (propuesta: `europe-southwest1`, Madrid).
- Acceso **solo desde el servidor** con el Admin SDK, detrás de puertos (ADR-0006). `firestore.rules`
  deniega toda lectura y escritura de cliente.
- `db/` contiene los esquemas zod de cada colección (`db/schemas/`), `firestore.rules` y
  `firestore.indexes.json`: es la fuente de la verdad del modelo y de donde se genera
  `docs/context/data-model.md` (ADR-0007).
- Colecciones iniciales: `chapters`, `organizers` (con `chapterIds[]` y rol por capítulo), `events`,
  `sponsors`, `sponsorships`, `syncRuns`, `users`, `profileClaims` y `suppressions` (ocultaciones que el
  sync debe respetar). El id de documento de lo importado es el id de origen, así el upsert es idempotente.

## Alternativas descartadas

- **PostgreSQL** (ADR-0003): más potente en relaciones N:M, pero añade un proveedor más fuera de GCP.
- **Realtime Database**: consultas más pobres; Firestore es la opción recomendada por Firebase para datos
  nuevos.
- **Acceso directo desde el navegador con reglas**: obligaría a duplicar la lógica de permisos y
  visibilidad (ocultación RGPD) en las reglas, y acoplaría la UI a Firestore.

## Consecuencias

- Sin migraciones: los cambios de forma se gestionan con esquemas zod tolerantes y, si hace falta, un
  script de backfill idempotente en `db/scripts/`.
- Las relaciones N:M se desnormalizan (p. ej. nombre y logo del capítulo copiados en el evento); el sync
  es quien las mantiene coherentes.
- Consultas compuestas necesitan índices declarados en `firestore.indexes.json`.
- Tests de adaptadores contra el Firebase Emulator Suite, nunca contra producción.

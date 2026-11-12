# RF-SYNC-002: Importar capítulos de España

## Descripción
El sistema importa todos los capítulos GDG de España desde la fuente y los guarda en la BD propia con upsert por id de origen.

## Criterios de Aceptación
- [x] Solo se guardan capítulos cuyo país es España; el resto se descarta en la ingesta
- [x] Por capítulo se guarda: nombre, slug, ciudad, región de origen, comunidad autónoma, coordenadas, descripción, logo e imagen, enlaces públicos, miembros, si es GDG on Campus, `sourceId`, `sourceUrl`, `syncedAt` (la fuente no da provincia)
- [ ] Coordenadas de los capítulos que no las traen (3 a 2026-11-12) geocodificadas — *pendiente de la clave de Geocoding*
- [x] Re-ejecutar la importación no duplica capítulos (idempotente)
- [x] Los campos propios (`own`) y la ocultación (`hiddenAt`) no se sobrescriben
- [x] Un capítulo que desaparece de la fuente o pasa a inactivo se marca inactivo, salvo si falla más de la mitad de la ejecución

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/sync`)
- Base de datos (Firestore, `db/`)
- Sync (`src/sync`, adaptador `GdgSourcePort`)

### Dependencias
- RF-SYNC-001

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Coordenadas: las de la fuente; si faltan, Google Geocoding API (ADR-0010), pendiente.
- Documento `chapters/{sourceId}` en Firestore (ADR-0008).
- La fuente no normaliza `state` (`Andalusia`, `AN`, `Community of Madrid`…): tabla propia `state` →
  comunidad autónoma, con test que cubra todos los valores de la semilla.
- Origen: página del capítulo (`__NEXT_DATA__`) y semilla `db/seed/chapters-es.json`; descubrimiento de nuevos
  por `sitemap-chapters.xml` (ver `docs/tech/sync.md`).
- Cumple AGENTS.md regla 4 (solo España).

## Implementación
- `db/schemas/chapter.schema.ts` — documento `chapters/{sourceId}`
- `db/firestore.rules`, `db/storage.rules`, `db/firestore.indexes.json`, `firebase.json` — reglas e emuladores
- `src/shared/geo/comunidades.ts` (+ test) — región de la fuente → comunidad autónoma
- `src/modules/sync/ports/gdg-source.port.ts`, `ports/chapter-repository.port.ts` — puertos
- `src/modules/sync/import-chapters.service.ts` (+ test) — caso de uso
- `src/infrastructure/gdg-source/next-data.parser.ts`, `robots.ts`, `http-gdg-source.adapter.ts` (+ tests con fixtures)
- `src/infrastructure/firestore/admin.ts`, `chapter-repository.adapter.ts` (+ test con emulador)
- `src/composition.ts`, `src/sync/run-chapters.ts` — `npm run sync`
- `.github/workflows/ci.yml` — job `Firestore (emulador)`

## Estado
- [x] Análisis completado
- [x] Código implementado
- [ ] Tests pasando — unitarios en verde; los del emulador se verifican en el CI
- [x] Documentación actualizada

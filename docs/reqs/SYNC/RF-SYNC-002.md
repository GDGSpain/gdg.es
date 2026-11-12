# RF-SYNC-002: Importar capítulos de España

## Descripción
El sistema importa todos los capítulos GDG de España desde la fuente y los guarda en la BD propia con upsert por id de origen.

## Criterios de Aceptación
- [ ] Solo se guardan capítulos cuyo país es España; el resto se descarta en la ingesta
- [ ] Por capítulo se guarda: nombre, slug, ciudad, provincia, comunidad autónoma, coordenadas, descripción, logo/imagen, enlaces públicos, `sourceId`, `sourceUrl`, `syncedAt`
- [ ] Re-ejecutar la importación no duplica capítulos (idempotente)
- [ ] Los campos propios (no de origen) no se sobrescriben

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
- Coordenadas: las de la fuente; si faltan, Google Geocoding API (ADR-0010).
- Documento `chapters/{sourceId}` en Firestore (ADR-0008).
- La fuente no normaliza `state` (`Andalusia`, `AN`, `Community of Madrid`…): tabla propia `state` →
  comunidad autónoma, con test que cubra todos los valores de la semilla.
- Origen: página del capítulo (`__NEXT_DATA__`) y semilla `db/seed/chapters-es.json`; descubrimiento de nuevos
  por `sitemap-chapters.xml` (ver `docs/tech/sync.md`).
- Cumple AGENTS.md regla 4 (solo España).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

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
- La comunidad autónoma puede no venir en la fuente: derivarla de la provincia/ciudad con una tabla propia.
- Cumple AGENTS.md regla 4 (solo España).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

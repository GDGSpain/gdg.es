# RF-MAP-002: Mapa dinámico de eventos

## Descripción
Mapa de los eventos presenciales e híbridos, que se actualiza al cambiar filtros.

## Criterios de Aceptación
- [ ] Marcadores de eventos presenciales/híbridos según los filtros de RF-EVENTS-001 (fechas, capítulo, comunidad, formato)
- [ ] Por defecto: próximos 30 días
- [ ] Varios eventos en el mismo lugar se agrupan en un marcador con la lista
- [ ] Los eventos online se listan aparte (no tienen ubicación)
- [ ] Al mover/zoom del mapa la lista lateral muestra solo los eventos visibles

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/map`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-004
- RF-EVENTS-001
- RF-MAP-001

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Comparte componente de mapa con RF-MAP-001 (Google Maps, ADR-0010).
- Los datos del mapa los sirve el servidor ya filtrados; el navegador nunca consulta Firestore.

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

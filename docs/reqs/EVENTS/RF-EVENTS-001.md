# RF-EVENTS-001: Agenda de eventos

## Descripción
Página pública con los eventos de todos los capítulos de España, filtrable.

## Criterios de Aceptación
- [ ] Por defecto muestra los próximos eventos ordenados por fecha
- [ ] Filtros: rango de fechas, capítulo, comunidad autónoma, formato (presencial/online/híbrido)
- [ ] Pestaña de eventos pasados
- [ ] Vista lista y acceso a la vista mapa (RF-MAP-002) con los mismos filtros
- [ ] Los eventos cancelados se muestran marcados o se ocultan

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/events`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-004

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Los filtros viven en la URL (compartibles).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

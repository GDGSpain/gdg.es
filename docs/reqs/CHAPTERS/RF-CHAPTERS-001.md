# RF-CHAPTERS-001: Directorio de capítulos

## Descripción
Página pública con todos los capítulos activos de España, buscable y filtrable.

## Criterios de Aceptación
- [ ] Lista de capítulos activos con logo, nombre, ciudad y número de próximos eventos
- [ ] Búsqueda por nombre o ciudad
- [ ] Filtro por comunidad autónoma
- [ ] Cada capítulo enlaza a su ficha (RF-CHAPTERS-002)
- [ ] Página indexable (renderizado en servidor, metadatos y sitemap)

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/chapters`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Acceso al mapa de capítulos (RF-MAP-001) desde la misma página.

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

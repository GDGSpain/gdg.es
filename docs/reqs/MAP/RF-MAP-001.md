# RF-MAP-001: Mapa de capítulos

## Descripción
Mapa de España con un marcador por capítulo activo.

## Criterios de Aceptación
- [ ] Un marcador por capítulo en sus coordenadas; agrupación (clustering) al alejar
- [ ] Al pulsar un marcador: tarjeta con nombre, ciudad y enlace a la ficha
- [ ] Incluye Canarias, Baleares, Ceuta y Melilla en la vista inicial o con acceso rápido
- [ ] Accesible: alternativa en lista para lectores de pantalla

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/map`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Google Maps JavaScript API con Advanced Markers y `@googlemaps/markerclusterer` (ADR-0010).
- El mapa se carga solo en las páginas que lo usan (coste por carga).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

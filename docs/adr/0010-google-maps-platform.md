# ADR-0010: Google Maps Platform para mapas y geocodificación

- **Estado**: Aceptada
- **Fecha**: 2026-10-27
- **RF relacionados**: RF-MAP-001, RF-MAP-002, RF-SYNC-002, RF-SYNC-004, RF-EVENTS-002

## Contexto

El mapa de eventos es una de las piezas centrales del producto. El autor dispone de un proyecto de GCP
con facturación para Google Maps Platform.

## Decisión

- **Maps JavaScript API** en el navegador con `@vis.gl/react-google-maps`, **Advanced Markers** (requiere
  Map ID) y `@googlemaps/markerclusterer` para agrupar.
- **Geocoding API** solo en el servidor, durante el sync, cuando la fuente no trae coordenadas.
- Dos claves: navegador (restringida por referrer y a Maps JavaScript API) y servidor (restringida a
  Geocoding API). Presupuesto y alertas de facturación configurados en GCP.

## Alternativas descartadas

- **MapLibre + OpenStreetMap**: sin coste por uso, pero el autor prefiere Google Maps y tiene el proyecto.

## Consecuencias

- Coste por carga de mapa y por geocodificación: se mitiga cargando el mapa solo en las páginas que lo
  usan y geocodificando una vez por lugar.
- **Revisar los términos de Google Maps Platform** sobre cuánto tiempo se pueden guardar resultados de
  geocodificación; priorizar las coordenadas que trae la fuente y refrescar las geocodificadas según lo
  que permitan los términos.

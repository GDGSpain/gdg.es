# RF-SYNC-004: Importar eventos de los capítulos

## Descripción
Se importan los eventos próximos y pasados de cada capítulo de España con su fecha, lugar y formato.

## Criterios de Aceptación
- [ ] Por evento: título, fecha/hora de inicio y fin (zona Europe/Madrid), formato (presencial/online/híbrido), lugar y coordenadas si es presencial, URL de la fuente, imagen, capítulo
- [ ] Se importan los eventos futuros y los de los últimos 12 meses
- [ ] Un evento cancelado en la fuente queda marcado como cancelado
- [ ] Idempotente por `sourceId`

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/sync`)
- Base de datos (Firestore, `db/`)
- Sync (`src/sync`, adaptador `GdgSourcePort`)

### Dependencias
- RF-SYNC-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- **Pendiente de decidir**: ventana de histórico (12 meses propuesto).
- Si el lugar no trae coordenadas, geocodificar en la ingesta con Google Geocoding API (ADR-0010), una vez
  por lugar y respetando los términos sobre cuánto tiempo se guarda el resultado.

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

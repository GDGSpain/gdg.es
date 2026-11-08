# RF-SYNC-005: Sincronización programada con registro de ejecuciones

## Descripción
El job se ejecuta automáticamente con un intervalo configurable, registra cada ejecución y detecta bajas.

## Criterios de Aceptación
- [ ] Se ejecuta una vez al día con Cloud Scheduler llamando a `POST /api/sync/run` (protegido con `SYNC_SECRET`), y también a mano (`npm run sync` y botón en el panel, RF-ADMIN-001)
- [ ] Cada ejecución guarda en `syncRuns` inicio, fin, resultado y contadores (creados, actualizados, inactivos, errores)
- [ ] Un capítulo que desaparece de la fuente se marca inactivo y se oculta; no se borra
- [ ] Un fallo en un capítulo no aborta el resto; si falla más del 50 %, la ejecución se marca fallida y no marca inactivos
- [ ] Ritmo limitado y `User-Agent` identificable (`SYNC_USER_AGENT`)

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/sync`)
- Base de datos (Firestore, `db/`)
- Sync (`src/sync`, adaptador `GdgSourcePort`)

### Dependencias
- RF-SYNC-002
- RF-SYNC-003
- RF-SYNC-004

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Programación con Cloud Scheduler (ADR-0011, propuesta). Si el sync supera el timeout de la petición, se
  parte por capítulos o pasa a una Cloud Function.

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

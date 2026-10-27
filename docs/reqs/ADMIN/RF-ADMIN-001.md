# RF-ADMIN-001: Estado de la sincronización

## Descripción
El admin ve el historial de ejecuciones del sync y puede lanzarlo a mano.

## Criterios de Aceptación
- [ ] Lista de ejecuciones con fecha, duración, resultado y contadores (RF-SYNC-005)
- [ ] Detalle de errores por capítulo
- [ ] Botón "Sincronizar ahora" (no permite dos ejecuciones simultáneas)
- [ ] Aviso visible si la última ejecución correcta tiene más de 48 h

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/admin`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-005
- RF-AUTH-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Ninguna

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

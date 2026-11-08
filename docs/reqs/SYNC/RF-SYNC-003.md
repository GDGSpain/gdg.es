# RF-SYNC-003: Importar organizadores de cada capítulo

## Descripción
Para cada capítulo importado se obtienen sus organizadores y se guardan como personas únicas relacionadas N:M con sus capítulos.

## Criterios de Aceptación
- [ ] Se guardan solo datos públicos: nombre, foto, rol en el capítulo, enlaces públicos; nunca email ni teléfono
- [ ] Una misma persona organizadora de varios capítulos es un único organizador con varias relaciones
- [ ] Un organizador que pidió ocultarse (RF-ADMIN-003) no se reimporta ni se muestra
- [ ] Si un organizador deja de figurar en un capítulo, se elimina esa relación

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
- **Pendiente de decidir**: criterio de deduplicación entre capítulos (id de perfil de la fuente si existe; si no, nombre + foto).
- Ver `docs/legal/` (datos personales).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

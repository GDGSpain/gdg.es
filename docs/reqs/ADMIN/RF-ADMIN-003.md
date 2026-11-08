# RF-ADMIN-003: Ocultar perfiles y datos (oposición RGPD)

## Descripción
El admin puede ocultar un organizador, capítulo o evento, y la ocultación sobrevive a las sincronizaciones.

## Criterios de Aceptación
- [ ] Ocultar/mostrar organizadores, capítulos y eventos con un motivo
- [ ] Lo oculto no aparece en ninguna página ni API pública
- [ ] El sync respeta la ocultación (no reimporta ni vuelve a mostrar)
- [ ] Solicitudes de ocultación de organizadores (RF-ORGANIZERS-002) en una bandeja con aprobar/rechazar

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/admin`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-003
- RF-AUTH-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Ver `docs/legal/` (derecho de oposición y supresión).

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

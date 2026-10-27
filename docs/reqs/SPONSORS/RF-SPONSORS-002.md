# RF-SPONSORS-002: Asociar sponsors a capítulos y eventos

## Descripción
Los admins (y organizadores, para su capítulo) gestionan la relación sponsor ↔ capítulo/evento.

## Criterios de Aceptación
- [ ] Alta, edición y baja de sponsors desde el panel (RF-ADMIN-002)
- [ ] Asociar un sponsor a uno o varios capítulos y/o eventos, con periodo opcional (desde/hasta)
- [ ] Un organizador solo puede asociar sponsors a sus propios capítulos y eventos
- [ ] Las fichas de capítulo y evento muestran sus sponsors vigentes

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/sponsors`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-AUTH-002
- RF-ADMIN-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- **Pendiente de decidir**: ¿se intenta importar sponsors de la fuente si los expone?

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

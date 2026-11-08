# RF-CHAPTERS-002: Ficha de capítulo

## Descripción
Página pública de un capítulo con su información, organizadores, eventos y sponsors.

## Criterios de Aceptación
- [ ] Muestra nombre, descripción, ciudad, enlaces públicos y enlace a su página en gdg.community.dev
- [ ] Lista de organizadores con foto y rol, enlazados a su perfil (RF-ORGANIZERS-001)
- [ ] Próximos eventos y eventos pasados recientes
- [ ] Sponsors asociados al capítulo (RF-SPONSORS-002)
- [ ] URL estable por slug (`/capitulos/<slug>`); un capítulo inactivo devuelve 404 o aviso

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/chapters`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-002
- RF-SYNC-003
- RF-SYNC-004

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Indicar la fecha de la última sincronización.

## Implementación
<!-- Se rellena al implementar -->

## Estado
- [ ] Análisis completado
- [ ] Código implementado
- [ ] Tests pasando
- [ ] Documentación actualizada

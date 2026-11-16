# RF-CHAPTERS-002: Ficha de capítulo

## Descripción
Página pública de un capítulo con su información, organizadores, eventos y sponsors.

## Criterios de Aceptación
- [x] Muestra nombre, descripción (HTML saneado), ciudad, comunidad, miembros, enlaces públicos y enlace a su página en gdg.community.dev
- [ ] Lista de organizadores con foto y rol, enlazados a su perfil (RF-ORGANIZERS-001) — *foto y rol con RF-SYNC-003; el enlace al perfil llega con RF-ORGANIZERS-001*
- [ ] Próximos eventos y eventos pasados recientes — *pendiente de RF-SYNC-004*
- [ ] Sponsors asociados al capítulo (RF-SPONSORS-002) — *pendiente*
- [x] URL estable por slug (`/capitulos/<slug>`); un capítulo inexistente, inactivo u oculto muestra "Capítulo no encontrado"

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
- Indica la fecha de la última sincronización (Europe/Madrid).
- La descripción se sanea con `sanitize-html` (`src/shared/html/sanitize.ts`): sin scripts ni estilos, enlaces
  con `rel="noopener noreferrer nofollow"`.
- Con Cache Components la ficha se transmite en streaming: la página de "no encontrado" se muestra bien pero
  responde 200, no 404. Revisar al añadir el sitemap.

## Implementación
- `src/modules/chapters/get-chapter.service.ts` (+ test) — caso de uso
- `src/shared/html/sanitize.ts` (+ test) — saneado del HTML de la fuente
- `src/app/capitulos/[slug]/page.tsx`, `page.module.css`, `not-found.tsx` — ficha
- `src/app/page.tsx` — enlace al directorio desde la portada

## Estado
- [x] Análisis completado
- [ ] Código implementado — *falta eventos y sponsors*
- [x] Tests pasando
- [x] Documentación actualizada

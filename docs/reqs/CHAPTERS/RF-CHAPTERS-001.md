# RF-CHAPTERS-001: Directorio de capítulos

## Descripción
Página pública con todos los capítulos activos de España, buscable y filtrable.

## Criterios de Aceptación
- [x] Lista de capítulos activos con logo, nombre, ciudad y comunidad (el número de próximos eventos llega con RF-SYNC-004)
- [x] Búsqueda por nombre o ciudad (sin distinguir acentos ni mayúsculas)
- [x] Filtro por comunidad autónoma, con el número de capítulos de cada una
- [x] Cada capítulo enlaza a su ficha (RF-CHAPTERS-002)
- [ ] Página indexable (renderizado en servidor y metadatos hechos; *falta el sitemap*)

## Impacto

### Módulos Afectados
- Web (Next.js)
- Casos de uso (`src/modules/chapters`)
- Base de datos (Firestore, `db/`)

### Dependencias
- RF-SYNC-002

### Conflictos Potenciales
- Ninguno detectado

## Notas Técnicas
- Acceso al mapa de capítulos (RF-MAP-001) desde la misma página, cuando exista.
- Filtros en la URL (`?q=`, `?comunidad=`) con formulario GET: funciona sin JavaScript.
- Solo se listan capítulos activos y no ocultos (`isPublic`).

## Implementación
- `src/modules/chapters/chapter.ts`, `ports/chapter-reader.port.ts` — dominio y puerto
- `src/modules/chapters/list-chapters.service.ts` (+ test) — caso de uso
- `src/infrastructure/firestore/chapter-reader.adapter.ts` (+ test con emulador)
- `src/app/capitulos/page.tsx`, `page.module.css`, `error.tsx` — página
- `src/app/_components/` — cabecera, pie y logo de capítulo
- `next.config.ts` — imágenes de `res.cloudinary.com`

## Estado
- [x] Análisis completado
- [x] Código implementado
- [ ] Tests pasando — caso de uso en verde; el del lector, en el CI con emulador
- [x] Documentación actualizada

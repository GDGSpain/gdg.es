# RF-SYNC-003: Importar organizadores de cada capítulo

## Descripción
Para cada capítulo importado se obtienen sus organizadores y se guardan como personas únicas relacionadas N:M con sus capítulos.

## Criterios de Aceptación
- [x] Se guardan solo datos públicos: nombre, foto, rol en el capítulo y usuario de X; nunca email, teléfono, empresa, puesto ni bio
- [x] Una misma persona organizadora de varios capítulos es un único organizador con varias relaciones (`organizers/{profileId}`, `chapterIds`, `roles`)
- [ ] Un organizador que pidió ocultarse (RF-ADMIN-003) no se reimporta ni se muestra — *no se muestra si tiene `hiddenAt` y el sync no lo pisa; falta el flujo de ocultación (RF-ADMIN-003)*
- [x] Si un organizador deja de figurar en un capítulo, se elimina esa relación (sin tocar sus otros capítulos)

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
- Deduplicación por `user.profile_url` (`/u/{id}/`) de `chapterTeam`; el sync guarda ese id pero nunca
  pide `/u/` (prohibido por `robots.txt`).
- No se importan `company`, `title` (puesto) ni `bio`, aunque la fuente los publique (minimización).
- Ver `docs/legal/` (datos personales).

## Implementación
- `db/schemas/organizer.schema.ts` — documento `organizers/{profileId}`
- `src/modules/sync/ports/gdg-source.port.ts` (`SourceTeamMember`), `ports/organizer-repository.port.ts`
- `src/modules/sync/import-chapters.service.ts` (+ test) — guarda el equipo de cada capítulo importado
- `src/infrastructure/gdg-source/next-data.parser.ts` (`parseTeam`, + tests con fixtures)
- `src/infrastructure/firestore/organizer-repository.adapter.ts` (+ test con emulador)
- `src/modules/chapters/get-chapter.service.ts`, `src/infrastructure/firestore/chapter-reader.adapter.ts`,
  `src/app/capitulos/[slug]/page.tsx`, `src/app/_components/person-avatar.tsx` — equipo en la ficha

## Estado
- [x] Análisis completado
- [x] Código implementado
- [ ] Tests pasando — unitarios en verde; los del emulador, en el CI
- [x] Documentación actualizada

---
name: architecture
description: Consultar el stack tecnológico (Next.js, Firebase, Google Maps), patrones y convenciones de carpetas/nombres de GDG.es. Usar cuando haya dudas de dónde ubicar código o cómo encajan web, casos de uso, Firestore y sincronización.
---

# Arquitectura GDG.es

El *porqué* de cada decisión está en `docs/adr/`; las reglas comunes, en `AGENTS.md`. Esta skill es el
*cómo*.

## Stack

| Capa | Tech | ADR |
|---|---|---|
| Web + API | Next.js (App Router), TypeScript estricto | 0002 |
| Base de datos | Cloud Firestore, solo desde el servidor (Admin SDK) | 0008 |
| Datos | Importados de gdg.community.dev por un job; nunca en tiempo de petición | 0004, 0005 |
| Capas | Casos de uso con puertos y `Result<T,E>` | 0006 |
| Validación | zod | — |
| Mapas | Google Maps JS API (`@vis.gl/react-google-maps`, Advanced Markers, clustering); Geocoding en el sync | 0010 |
| Auth | Firebase Authentication (Google) + cookie de sesión; roles como custom claims | 0009 |
| Ficheros | Cloud Storage for Firebase (logos de sponsors) | 0008 |
| Hosting / cron | Firebase App Hosting + Cloud Scheduler (propuesta) | 0011 |
| Tests | Vitest, Firebase Emulator Suite, Playwright | — |

## Estructura

```
src/
  app/                       # rutas Next.js: páginas públicas, /admin, /api
  modules/<dominio>/         # sync, chapters, organizers, events, map, sponsors, auth, admin
    *.service.ts             # casos de uso → Result<T,E>
    *.schema.ts              # zod
    ports/                   # interfaces en lenguaje de dominio
  infrastructure/
    firestore/               # adaptadores de repositorio (Admin SDK)
    gdg-source/              # adaptador GdgSourcePort (API/HTML de gdg.community.dev)
    firebase-auth/  google-maps/  storage/
  shared/
    config/config.ts         # único sitio que lee process.env (zod, fail-fast)
    result.ts  errors/
  sync/                      # job de importación + __fixtures__/
db/
  schemas/                   # esquemas zod por colección (fuente de data-model.md)
  firestore.rules            # deniega todo acceso de cliente
  firestore.indexes.json
  scripts/                   # backfills idempotentes
```

## Regla de dependencias

`app/` y `sync/` → `modules/` → `shared/`. `infrastructure/` implementa puertos de `modules/`.
`modules/` nunca importa `infrastructure/` ni `app/`. Cableado en `src/composition.ts`.

## Formato de respuesta de `/api`

`{ "data": … }` en éxito, `{ "error": { "code": "…", "message": "…" } }` en fallo. Nunca detalles internos.

## Nombres

- Ficheros en kebab-case; rutas públicas en español (`/capitulos`, `/organizadores`, `/eventos`, `/mapa`,
  `/sponsors`).
- Colecciones en camelCase plural: `chapters`, `organizers`, `events`, `sponsors`, `sponsorships`,
  `syncRuns`, `users`, `profileClaims`, `suppressions`.
- Documento importado: id = id de origen; campos de procedencia `sourceId`, `sourceUrl`, `syncedAt`,
  `hiddenAt`. Campos propios agrupados en `own` para que el sync nunca los pise.
- Relaciones N:M desnormalizadas: `organizers.chapterIds[]` + `organizers.roles{chapterId: rol}`;
  `events.chapter{ id, name, slug }`.
- Fechas como `Timestamp` en UTC; se muestran en Europe/Madrid.

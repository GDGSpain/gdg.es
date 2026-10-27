# AGENTS.md — cómo trabajar en GDG.es

Guía común para cualquier agente de código (y para personas). `CLAUDE.md` la importa y solo añade lo
específico de Claude Code (skills y subagentes). Si algo de aquí choca con una skill, manda este fichero
y la skill se corrige.

**GDG.es** es el directorio dinámico de los Google Developer Groups de España: capítulos, perfiles de
organizadores, sponsors compartidos y un mapa de eventos. Los datos se **importan** de
[gdg.community.dev](https://gdg.community.dev/) (solo capítulos de España) a una base de datos propia y la
web se sirve desde ahí. Es la nueva versión de **gdg.es**, la web oficial de GDG Spain
([GDGSpain/gdg.es](https://github.com/GDGSpain/gdg.es)); la app Polymer anterior vive en `legacy/`. Stack: **Next.js (App Router, TypeScript)** + **Firebase** (Cloud Firestore y
Firebase Authentication con Google) + **Google Maps Platform**, con un job de sincronización programado. Se desarrolla como TFM de Rei (un único autor: la IA propone, el autor decide).

## Mapa del repo

| Carpeta | Qué es |
|---|---|
| `src/app/` | Rutas de Next.js (páginas públicas, panel `/admin`, route handlers `/api`) |
| `src/modules/<dominio>/` | Lógica por dominio: casos de uso, esquemas zod, puertos |
| `src/infrastructure/` | Adaptadores: Firestore (Admin SDK), cliente de gdg.community.dev, Google Maps (geocodificación), Firebase Auth |
| `src/shared/` | Reutilizable: `Result<T,E>`, config validada, errores, utilidades |
| `src/sync/` | Job de importación desde gdg.community.dev (dominio SYNC) |
| `db/` | Esquemas zod de las colecciones, `firestore.rules` e `firestore.indexes.json` (fuente de la verdad del modelo de datos) |
| `docs/` | Requisitos, ADR, contexto, arquitectura, operación y RGPD (ver `docs/README.md`) |
| `legacy/` | App Polymer anterior (2016–2020), solo referencia; `legacy/data/groups.json` es semilla de capítulos |

> Cambiar esta estructura exige un ADR.

## Fuentes de la verdad

Consultar antes de proponer nada; no releer enteras, buscar lo concreto.

| Pregunta | Dónde |
|---|---|
| **Qué** debe hacer el producto | `docs/reqs/<DOMINIO>/RF-<DOMINIO>-NNN.md`; índice de una línea por RF en el `README.md` de cada dominio |
| **Con qué datos y contratos** | `docs/context/`: `data-model.md`, `api.md` (generados) y `glossary.md` (manual) |
| **Por qué** está hecho así | `docs/adr/` |
| **Cómo encaja** todo | `docs/arquitectura/` (C4 en Mermaid) |
| **Cómo** se despliega y opera | `docs/tech/` |
| Obligaciones legales (RGPD) | `docs/legal/` |

Dominios: `SYNC`, `CHAPTERS`, `ORGANIZERS`, `EVENTS`, `MAP`, `SPONSORS`, `AUTH`, `ADMIN`.

## Reglas que no se negocian

1. **Nunca implementar sin confirmación explícita.** Primero un plan (lista de ficheros + una línea cada
   uno), después esperar "sí"/"adelante". Un cambio que choque con un ADR se pregunta siempre.
2. **El agente commitea solo en ramas de trabajo** (`feat/…`, `fix/…`, `docs/…`), con Conventional
   Commits y la skill `commit`. **Nunca** commitea en `develop` ni en `master`, ni hace push, abre PR o
   fusiona sin confirmación explícita del usuario.
3. **La web nunca consulta gdg.community.dev al servir una página.** Solo el job de `SYNC` habla con la
   fuente; las páginas leen de nuestra base de datos ([ADR-0004](docs/adr/0004-ingesta-a-bd-propia.md)).
4. **Solo España.** Todo dato importado se filtra por país en la ingesta; un capítulo fuera de España no
   entra en la base de datos.
5. **Regla de dependencias**: `modules/` no importa `infrastructure/` ni `app/`; `shared/` no importa a
   nadie. Los casos de uso reciben sus puertos por parámetro y devuelven `Result<T,E>`.
6. **Ningún módulo lee `process.env`** salvo `shared/config/config.ts` (zod, fail-fast).
7. **El navegador nunca lee ni escribe Firestore.** Todo acceso a datos pasa por el servidor con el Admin
   SDK; las reglas de Firestore deniegan todo acceso de cliente. El navegador solo usa el SDK de Firebase
   Auth para iniciar sesión con Google y entrega el ID token al servidor, que crea una cookie de sesión
   ([ADR-0008](docs/adr/0008-firestore.md), [ADR-0009](docs/adr/0009-firebase-auth-google.md)).
8. **Datos personales mínimos**: de los organizadores solo lo que ya es público en gdg.community.dev
   (nombre, foto, rol, capítulo, enlaces públicos). Nada de emails ni teléfonos. Ver `docs/legal/`.
9. **Trazabilidad**: todo fichero o clase creado para un RF lo cita en su comentario de cabecera (todos
   los RF si son varios). Documentación y comentarios **en español**.

## Flujo de un cambio

```
RF (docs/reqs) → plan de ficheros → confirmación → código + tests → docs/context regenerado → RF actualizado
```

1. Localizar el RF y sus dependencias en el `README.md` del dominio. Si no existe, se crea antes
   (skill `manage-requirement` en Claude; a mano con `docs/reqs/TEMPLATE.md`).
2. Mirar `docs/context/` antes de proponer: ¿existe ya la tabla o el endpoint? ¿El término significa lo
   que creo (`glossary.md`)?
3. Buscar algo reutilizable en `src/shared/` antes de crear.
4. Proponer el plan y esperar confirmación.
5. Implementar:
   - **Página o route handler** (`src/app/`) → **caso de uso** (`src/modules/<dominio>/*.service.ts`,
     devuelve `Result<T,E>`) → **puerto** (`ports/*.port.ts`) → **adaptador** (`src/infrastructure/`).
     Entradas validadas con zod en el borde.
   - **Base de datos**: colección o campo nuevo → esquema zod en `db/schemas/`, índice compuesto en
     `db/firestore.indexes.json` si la consulta lo necesita. Las reglas siguen denegando el acceso de cliente.
   - **Sync**: cada importador es idempotente (upsert por id de origen) y registra su ejecución.
6. Tests de la capa que toca (tabla de abajo).
7. Regenerar `docs/context` si cambió el esquema o una ruta.
8. Actualizar el RF: casillas de `Estado` y lista de ficheros que lo implementan.

## Cómo testear

| Capa | Herramienta | Qué se testea |
|---|---|---|
| Casos de uso (`modules/`) | Vitest con fakes de los puertos | Reglas de negocio: filtro España, deduplicado, visibilidad, permisos |
| Importadores (`sync/`) | Vitest con fixtures HTML/JSON guardados de la fuente | Que el parseo sobrevive a la estructura real y falla de forma explícita si cambia |
| Adaptadores Firestore | Vitest contra el **Firebase Emulator Suite** | Consultas, índices y transacciones reales sin tocar producción |
| Route handlers | Vitest + petición HTTP simulada | Códigos de estado, formato `{ data }` / `{ error }`, auth |
| Flujos críticos | Playwright | Directorio → ficha de capítulo → organizador; mapa de eventos |

Criterio: se testean las ramas que codifican **decisiones de negocio**, no getters ni el framework.
Los tests nunca llaman a gdg.community.dev de verdad: usan fixtures en `src/sync/__fixtures__/`.

## Seguridad

- **Secretos**: nunca en el repo; `.env` ignorado y `.env.example` sin valores reales.
- **Entrada**: todo body y query se valida con zod; el error handler nunca devuelve detalles internos.
- **Credenciales de Firebase/GCP**: la cuenta de servicio y las claves van en `.env.local` (ignorado) o en
  el gestor de secretos del hosting; nunca en el repo ni en el chat con agentes.
- **Claves de Google Maps**: una clave de navegador restringida por referrer HTTP y solo a Maps JavaScript
  API; otra de servidor restringida a Geocoding API. Cuotas y alertas de facturación en GCP.
- **Panel `/admin`**: solo rol `admin` (custom claim de Firebase); un organizador solo edita lo suyo.
- **Scraping responsable**: respetar `robots.txt` y términos de la fuente, `User-Agent` identificable,
  ritmo limitado y caché. Ver [ADR-0005](docs/adr/0005-metodo-de-extraccion.md).
- **RGPD**: un cambio que trate datos personales nuevos se refleja en `docs/legal/` en el mismo cambio.

## Git

- `develop` es la rama por defecto e integración; `master` es producción. Ramas `feat/…`, `fix/…`,
  `docs/…` desde `develop` y PR a `develop` con el CI en verde (skill `create-pr`). `develop` → `master`
  por PR para publicar.
- `legacy/` no se toca salvo para borrarlo cuando la nueva web esté en producción.
- Mensajes **Conventional Commits** (`feat(chapters): ficha de capítulo (RF-CHAPTERS-002)`), validados por
  commitlint en el hook `commit-msg`. Ámbito: dominio del RF o área (`web`, `db`, `sync`, `ci`, `docs`).
- Hooks con lefthook (`npm install` en la raíz): pre-commit formato + lint + typecheck; pre-push tests.
- La plantilla de PR pide el RF afectado, tests y `docs/context` regenerado.
- **release-please** genera `CHANGELOG.md`, tags y releases a partir de los commits: no se editan a mano.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

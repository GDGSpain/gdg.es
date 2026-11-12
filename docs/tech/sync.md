# Sincronización con gdg.community.dev

Resultado de RF-SYNC-001 (spike, 2026-11-12). Decisión en [ADR-0005](../adr/0005-metodo-de-extraccion.md).

## Qué permite la fuente

`robots.txt` de gdg.community.dev (copia en `src/sync/__fixtures__/robots.txt`):

- **Prohibido** para cualquier robot: `/api/`, `/u/` (perfiles), `/accounts/`, `/gql/` y otras internas.
- **Permitido**: páginas de capítulo, páginas de evento y sitemaps.
- `Crawl-delay: 2` → como mínimo 2 s entre peticiones.

La API JSON (`/api/chapter_region/`, `/api/chapter/{id}/event/`, `/api/event/{id}/`) existe y es la que
usa la propia web (y el repo de GDG Ourense), pero **un proceso automático no debe usarla**. El sync solo
lee páginas públicas y sitemaps.

Los [términos de participación](https://gdg.community.dev/participation-terms/) no mencionan la extracción
automática. Como gdg.es es la web oficial de GDG Spain, conviene pedir al programa de GDG (o a Bevy, la
plataforma) un acceso o permiso explícito; mientras tanto se aplican las reglas de arriba.

## De dónde sale cada dato

| Dato | Fuente | Campo |
|---|---|---|
| Lista de capítulos del mundo | `https://gdg.community.dev/sitemap-chapters.xml?p=1…5` (~2.040 URL) | `<loc>` |
| Capítulo | Página `https://gdg.community.dev/{slug}/` → `<script id="__NEXT_DATA__">` → `props.pageProps.chapterData` | `id`, `title`, `country` (**ES**), `city`, `state`, `latitude`, `longitude`, `logo`, `cropped_banner_url`, `description` (HTML), `website`, `twitter_handle`, `linkedin_page`, `instagram_handle`, `members_count`, `is_active`, `is_hidden` |
| Organizadores | Misma página → `prerenderData.chapterTeam[]` | `title` (rol en el capítulo), `user.full_name`, `user.cropped_avatar_url`, `user.profile_url` (id estable: `/u/{id}/`), `user.twitter` |
| Próximos eventos | Misma página → `prerenderData.upcomingEvents.results[]` (completos) | `title`, `start_date`, `url`, `cropped_banner_url` |
| Eventos pasados | `https://gdg.community.dev/sitemap-events-AAAA-MM.xml` (uno por mes) filtrando la URL por `/google-{slug}-presents-` | `<loc>` |
| Detalle de evento | Página del evento → `props.pageProps.eventData` | `id`, `title`, `start_date_iso`, `end_date_iso`, `event_timezone`, `is_virtual_event`, `audience_type`, `venue_name`, `venue_address`, `venue_city`, `venue_zip_code`, `chapter_id`, `static_url` |
| Sponsors del capítulo | Página del capítulo → `prerenderData.chapterSponsors.data[]` / `chapterPartners.data[]` | `company`, `url`, `logo`, `sponsor_type` |

## Hallazgos que afectan a los RF

- **España = `chapterData.country === "ES"`**. Hoy hay **38 capítulos activos**, de ellos 9 GDG on Campus
  (semilla en `db/seed/chapters-es.json`).
- **`state` no está normalizado**: mezcla nombres en inglés (`Andalusia`, `Catalonia`), códigos (`AN`, `CT`,
  `MD`, `VC`, `IB`, `CL`, `CN`) y variantes (`Madrid` / `Community of Madrid`). Hace falta una tabla propia a
  comunidad autónoma (RF-SYNC-002, RF-CHAPTERS-001).
- **3 capítulos sin coordenadas** (`latitude: null`): se geocodifica la ciudad (ADR-0010).
- **Organizadores**: `profile_url` (`/u/{id}/`) identifica a la persona entre capítulos → deduplicación
  resuelta (RF-SYNC-003). Se guarda el id, pero el sync nunca pide `/u/` (prohibido).
  Campos disponibles que **no** se importan por minimización: `company`, `title` (puesto), `bio`.
- **Eventos sin coordenadas**: solo dirección → geocodificación en el sync (RF-SYNC-004).
- **Formato del evento** (la fuente no lo da directamente):
  `is_virtual_event` y dirección → **híbrido**; `is_virtual_event` sin dirección → **online**; si no →
  **presencial**.
- **Pasados**: la página del capítulo solo trae los 4 últimos; el histórico de 12 meses se obtiene de los
  sitemaps mensuales (12 peticiones) + la página de cada evento.
- **Sponsors**: la fuente sí los publica por capítulo → RF-SPONSORS-002 puede importarlos como dato de
  origen además de los propios.

## Estrategia del sync

1. **Descubrir** (semanal): leer `sitemap-chapters.xml` (5 páginas). Los slugs que no estaban en la
   ejecución anterior se visitan una vez para leer su país; si es `ES`, se añaden. La primera vez se parte
   de `db/seed/chapters-es.json` y el resto de slugs actuales se marcan como vistos sin visitarlos.
2. **Capítulos** (diario): visitar la página de cada capítulo de España (38 × 2 s ≈ 1,5 min) → capítulo,
   organizadores, próximos eventos y sponsors.
3. **Eventos** (diario): para cada evento nuevo o futuro, visitar su página (detalle y dirección).
   Mensualmente, el sitemap del mes en curso y el anterior para no perder eventos.
4. **Histórico** (una vez): sitemaps de los últimos 12 meses.

Volumen diario aproximado: 40–60 peticiones, 2–3 minutos con la pausa de 2 s. `User-Agent` identificable
(`SYNC_USER_AGENT`) y caché HTTP (ETag/Last-Modified cuando la fuente los dé).

## Si la fuente cambia

Los tests de `src/sync/` usan los fixtures; si `__NEXT_DATA__` cambia de forma, el parseo (validado con
zod) falla con un error explícito, la ejecución queda como fallida en `syncRuns` y la web sigue sirviendo
lo último importado (ADR-0004). Se recapturan los fixtures y se ajusta el parser.

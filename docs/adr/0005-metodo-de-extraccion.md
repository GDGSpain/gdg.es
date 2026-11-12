# ADR-0005: Extraer de gdg.community.dev con páginas públicas y sitemaps, nunca con su API

- **Estado**: Aceptada
- **Fecha**: 2026-10-27 · aceptada 2026-11-12
- **RF relacionados**: RF-SYNC-001…005

## Contexto

gdg.community.dev (plataforma Bevy) carga sus listados desde una API JSON (`/api/…`) sin autenticación, que
otras webs de la comunidad usan directamente. Su `robots.txt` **prohíbe `/api/` y `/u/` a todos los
robots** y pide `Crawl-delay: 2`. Las páginas de capítulo y evento llevan sus datos completos en
`<script id="__NEXT_DATA__">` y hay sitemaps de capítulos y de eventos por mes. Detalle en
`docs/tech/sync.md`.

## Decisión

- El sync lee **solo** sitemaps (`sitemap-chapters.xml`, `sitemap-events-AAAA-MM.xml`) y páginas públicas de
  capítulo y evento, extrayendo `__NEXT_DATA__` y validándolo con zod.
- **Nunca** pide rutas prohibidas por `robots.txt`; el cliente HTTP (`GdgSourcePort`) lo comprueba antes de
  cada petición y respeta 2 s entre peticiones, con `User-Agent` identificable.
- La lista de capítulos de España parte de una semilla versionada (`db/seed/chapters-es.json`) que el sync
  verifica (`country === "ES"`) y amplía con los slugs nuevos del sitemap.
- Todo detrás del puerto `GdgSourcePort`, con fixtures en `src/sync/__fixtures__/`.

## Alternativas descartadas

- **API JSON interna**: más cómoda y completa, pero prohibida por `robots.txt` para procesos automáticos.
- **Recorrer los ~2.040 capítulos del mundo cada día** para encontrar los de España: ~70 min por ejecución
  con la pausa exigida; innecesario si se parte de una semilla y solo se visitan los slugs nuevos.
- **Navegador sin cabeza**: los datos ya vienen en el HTML; no hace falta ejecutar JavaScript.

## Consecuencias

- Respetamos las reglas de la fuente y el volumen es bajo (40–60 peticiones al día).
- Dependemos de la forma de `__NEXT_DATA__`, que no es un contrato público: los tests con fixtures y la
  validación zod hacen que un cambio falle de forma explícita sin romper la web (ADR-0004).
- El histórico de eventos pasados se reconstruye desde los sitemaps mensuales.
- Queda pedir al programa de GDG un acceso oficial; si llega, se cambia el adaptador sin tocar los casos de uso.

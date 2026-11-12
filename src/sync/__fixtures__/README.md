# Fixtures de gdg.community.dev

Capturas reales de la fuente (2026-11-12) para los tests del sync (RF-SYNC-001…004). Los tests **nunca**
llaman a gdg.community.dev (AGENTS.md § Cómo testear).

| Fichero | Qué es | Para qué |
|---|---|---|
| `chapter-gdg-madrid.html` | Página de capítulo con `__NEXT_DATA__` (`chapterData`, `chapterTeam`, eventos, sponsors) | Parseo de capítulo, organizadores, eventos y sponsors |
| `chapter-gdg-on-campus-ie.html` | Capítulo GDG on Campus: sin coordenadas, sin logo, sin sponsors, comunidad "Community of Madrid" | Casos límite |
| `event-in-person.html` | Página de evento presencial (`eventData` con dirección, sin coordenadas) | Formato presencial y geocodificación |
| `event-hybrid.html` | Evento con `is_virtual_event: true` y dirección | Formato híbrido |
| `sitemap-chapters.xml` | Extracto del sitemap de capítulos, con uno inventado (`gdg-nuevo-capitulo-ejemplo`) | Descubrir capítulos nuevos |
| `sitemap-events-2026-10.xml` | Extracto del sitemap mensual de eventos, con uno de otro país y uno de un slug parecido que no es nuestro (`gdg-madrid-norte`) | Filtrar eventos de España por slug |
| `robots.txt` | El de la fuente | Que el cliente nunca pida rutas prohibidas (`/api/`, `/u/`) |

## Cambios respecto al original

- **Organizadores anonimizados** (RGPD): nombres, avatares, perfiles y empresas sustituidos por
  `PersonaN Ejemplo`, `https://example.org/…` y `/u/ejemploN/`. La estructura es la real.
- `Persona9` aparece en los dos capítulos a propósito, para probar la deduplicación de organizadores.
- Textos largos y listas recortados; se quitaron agenda, ponentes y asistentes de los eventos.
- El sitemap de eventos añade dos URL que deben descartarse.

Si la fuente cambia de estructura, se vuelve a capturar y se anota la fecha aquí.

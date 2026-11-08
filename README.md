# [gdg.es](https://gdg.es) — Directorio de los Google Developer Groups de España

[![CI](https://github.com/GDGSpain/gdg.es/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/GDGSpain/gdg.es/actions/workflows/ci.yml)

> La web oficial de GDG Spain, en reconstrucción.

Web dinámica que reúne los **capítulos GDG de España**, los **perfiles de sus organizadores**, los
**sponsors compartidos** entre capítulos y un **mapa de eventos**. Los datos se importan de
[gdg.community.dev](https://gdg.community.dev/chapters/) y se sirven desde una base de datos propia.
Se desarrolla como trabajo de fin de máster sobre este repositorio, que lleva activo desde 2016.

## Qué hace

| | |
|---|---|
| **Capítulos** | Directorio de los GDG de España con búsqueda y filtro por comunidad autónoma, y ficha de cada capítulo |
| **Organizadores** | Perfil público de cada organizador con sus capítulos |
| **Eventos y mapa** | Agenda de eventos y mapa dinámico filtrable por fecha, capítulo y formato |
| **Sponsors** | Catálogo de sponsors y qué capítulos o eventos apoyan |
| **Sincronización** | Job programado que importa capítulos, organizadores y eventos de España |

## Stack

Next.js (App Router, TypeScript) · Firebase (Cloud Firestore, Authentication con Google, Storage) ·
Google Maps Platform · Vitest · GitHub Actions. Decisiones en [`docs/adr/`](docs/adr/README.md).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y rellena las variables
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm test
```

Más detalle en [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Cómo se construye

Requisitos antes que código ([`docs/reqs/`](docs/reqs)), decisiones escritas
([`docs/adr/`](docs/adr/README.md)) y reglas comunes para personas y agentes de código en
[`AGENTS.md`](AGENTS.md). Plan hasta la entrega (18/11/2026): [`PLAN.md`](PLAN.md).

## La web anterior

La app Polymer que sirvió gdg.es entre 2016 y 2020 está en [`legacy/`](legacy/LEGACY.md). Gracias a
todas las personas que la construyeron y mantuvieron.

## Licencia

[MIT](LICENSE.txt).

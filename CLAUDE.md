# GDG.es — Claude Code

@AGENTS.md

Lo de arriba (reglas, flujo, tests, seguridad, git) es común a cualquier agente. Aquí solo va lo
específico de Claude Code.

Stack: Next.js + Firebase (Firestore, Auth con Google, Storage) + Google Maps. Plan hasta el 18/11 en
`PLAN.md`.

## 🤖 Skills

Definidas en `.claude/skills/` (invocables con `/nombre`):

- **manage-requirement** - Crear/verificar/revisar RF (detecta conflictos y duplicados)
- **implement-requirement** - Codificar un RF (requiere confirmación)
- **architecture** - Stack, patrones y convenciones de carpetas (el *porqué* está en `docs/adr/`)
- **commit** - Preparar y crear commits Conventional Commits en la rama de trabajo
- **create-pr** - Preparar la PR a `develop` (pide confirmación antes de hacer push o abrirla)

Skills de diseño de terceros (sin modificar; origen y licencias en `.claude/skills/THIRD_PARTY.md`):

- **design-taste-frontend** - Dirección de arte de las páginas públicas (directorio, fichas, agenda,
  mapa): referencias reales de diseño para evitar el aspecto genérico de "hecho por IA". No para `/admin`
- **impeccable** - Auditar, criticar y pulir UI (`/impeccable audit|critique|polish|typeset|layout…`):
  espaciado, tipografía, jerarquía, accesibilidad y casos límite. Vale para web pública y `/admin`
- **emil-design-eng** - Animaciones y microdetalles (botones, transiciones, estados) con criterio:
  cuándo animar, curvas y duraciones, y respetar `prefers-reduced-motion`

Cómo combinarlas: `design-taste-frontend` decide la dirección visual de una página nueva →
`impeccable` la pule → `emil-design-eng` añade el movimiento. Mientras no exista un sistema de diseño
propio, el primero que se fije (tokens en `src/app/globals.css`) manda sobre las sugerencias de las
skills; los ejemplos en otros stacks se traducen a Next.js + CSS Modules.

## 🧩 Subagentes

Definidos en `.claude/agents/`:

- **test-writer** - Escribe y ejecuta tests de un RF o caso de uso. Delegarle los tests tras implementar
- **security-reviewer** - Revisa la seguridad del diff (solo lectura). Pasarlo antes de abrir una PR que
  toque auth, base de datos, el panel o la sincronización

## ⚡ Eficiencia de contexto

- No releer archivos ya cargados en esta conversación salvo que puedan haber cambiado
- Para localizar RFs usar primero el `README.md` del dominio; abrir el `.md` completo solo si hace falta
- Para datos y endpoints, buscar en `docs/context/` antes de abrir código
- Planes de implementación: lista de archivos + una línea, sin repetir el texto del RF
- Respuestas concisas y directas

## 📋 Requisitos

Ubicación: `docs/reqs/<DOMINIO>/RF-<DOMINIO>-NNN.md` · Template: `docs/reqs/TEMPLATE.md`

Dominios: `SYNC`, `CHAPTERS`, `ORGANIZERS`, `EVENTS`, `MAP`, `SPONSORS`, `AUTH`, `ADMIN`

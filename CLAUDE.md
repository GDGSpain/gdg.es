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

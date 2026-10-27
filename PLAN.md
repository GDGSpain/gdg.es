# Plan hasta la entrega — GDG.es

Entrega del TFM: **antes del 18/11/2026**. Hoy: 27/10/2026 → 3 semanas. Fecha interna de cierre de
funcionalidad: **15/11**; el 16 y el 17 son para pruebas, documentación y colchón.

Cada fase lleva: qué entra, cómo saber que está hecha. Las casillas `[ ]` se marcan según se completen.
El detalle de cada funcionalidad está en su RF (`docs/reqs/`); aquí solo el orden.

## Prioridad (MoSCoW)

| | RF |
|---|---|
| **Imprescindible** (sin esto no hay entrega) | SYNC-001…005 · CHAPTERS-001/002 · ORGANIZERS-001 · EVENTS-001 · MAP-002 · AUTH-001/002 · ADMIN-001 · ADMIN-003 (RGPD) |
| **Debería** | MAP-001 · EVENTS-002 · SPONSORS-001/002 · ADMIN-002 · ORGANIZERS-002 |
| **Podría** (se recorta primero) | Añadir al calendario (.ics) · sitemap · organizador gestiona sponsors de su capítulo |

Si una fase se retrasa, se recorta de abajo arriba; nunca los tests de las reglas de negocio ni el RGPD.

---

## Fase 0 — Puesta en marcha (27–30 oct)

- [ ] **GCP/Firebase** (lo hace Rei, ver "Qué necesito de ti"): Firestore en región europea, Auth con
      proveedor Google, Storage; Maps JavaScript API y Geocoding API activadas, dos claves restringidas,
      Map ID, presupuesto y alertas.
- [x] Rama `feat/tfm-directorio` en GDGSpain/gdg.es desde `develop`; app Polymer movida a `legacy/`.
- [ ] Proteger `develop` y `master` (PR obligatoria y CI en verde).
- [x] Next.js (App Router, TS estricto), ESLint con la regla de dependencias (ADR-0006), Vitest,
      lefthook + commitlint.
- [x] `src/shared/`: `config.ts` (zod, fail-fast), `result.ts` con tests.
- [ ] `src/composition.ts` (cuando exista el primer puerto).
- [ ] Firebase Emulator Suite (`npm run emulators`) y `db/firestore.rules` denegando todo a cliente.
- [x] CI (`.github/workflows/ci.yml`): commitlint, lint, typecheck, test con cobertura, build.
- [ ] Añadir los emuladores de Firebase al CI con el primer adaptador de Firestore.
- [ ] **RF-SYNC-001** (spike de la fuente) → ADR-0005 aceptada y fixtures guardados.

**Hecha cuando:** `npm run dev` arranca con los emuladores, el CI está en verde y sabemos de dónde sale
cada dato de gdg.community.dev.

## Fase 1 — Datos y directorio (31 oct – 6 nov)

- [ ] RF-SYNC-002 capítulos de España · RF-SYNC-003 organizadores · RF-SYNC-004 eventos.
- [ ] `npm run context` genera `docs/context/data-model.md` y `api.md` (ADR-0007) y entra en el pre-commit.
- [ ] RF-CHAPTERS-001 directorio · RF-CHAPTERS-002 ficha de capítulo.
- [ ] RF-AUTH-001 login con Google (Firebase Auth + cookie de sesión).

**Hecha cuando:** `npm run sync` llena el emulador con los capítulos reales de España y se navega
directorio → ficha de capítulo con organizadores y eventos.

## Fase 2 — Organizadores, eventos y mapa (7–12 nov)

- [ ] RF-ORGANIZERS-001 perfil y directorio de organizadores.
- [ ] RF-EVENTS-001 agenda · RF-EVENTS-002 ficha de evento.
- [ ] RF-MAP-002 mapa dinámico de eventos · RF-MAP-001 mapa de capítulos (Google Maps).
- [ ] RF-AUTH-002 roles con custom claims.
- [ ] RF-SYNC-005 sync programado + `syncRuns`.
- [ ] Despliegue en Firebase App Hosting y Cloud Scheduler → ADR-0011 aceptada; `docs/tech/deploy.md`.

**Hecha cuando:** la web está publicada con datos reales y se refresca sola cada día.

## Fase 3 — Gestión y RGPD (13–15 nov)

- [ ] RF-ADMIN-001 estado del sync · RF-ADMIN-003 ocultar perfiles (oposición RGPD).
- [ ] RF-SPONSORS-001 catálogo · RF-SPONSORS-002 asociaciones · RF-ADMIN-002 gestión de sponsors.
- [ ] RF-ORGANIZERS-002 reclamar y editar perfil.
- [ ] Página de privacidad y `docs/legal/` completado (base jurídica, encargados, derechos).

**Hecha cuando:** un admin puede operar el directorio sin tocar código y un organizador puede ocultarse.

## Fase 4 — Cierre (16–17 nov)

- [ ] Playwright: directorio → capítulo → organizador; agenda → mapa con filtros; login → panel.
- [ ] Revisión con el subagente `security-reviewer` y hallazgos corregidos o aceptados por escrito.
- [ ] Auditoría de RF: casillas de `Estado` e `Implementación` contra el código.
- [ ] README con cifras (RF, ADR, tests, cobertura) y capturas.
- [ ] Release `v1.0.0` con release-please.
- [ ] Memoria y presentación del TFM (fuera del repo).

---

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| La fuente no expone los datos o los bloquea | Sin datos no hay producto | Spike el primer día (SYNC-001); fixtures guardados; plan B: HTML o navegador sin cabeza tras el mismo puerto |
| La estructura de la fuente cambia durante el desarrollo | Sync roto | Tests con fixtures que fallan de forma explícita; la web sigue sirviendo lo último importado (ADR-0004) |
| Coste de Google Maps | Factura inesperada | Claves restringidas, presupuesto con alertas, mapa solo donde hace falta |
| Timeout del sync en App Hosting | Sync incompleto | Partir por capítulos o mover a Cloud Function (ADR-0011) |
| Tiempo (3 semanas, un autor) | Funcionalidad sin terminar | MoSCoW de arriba; recortar "Podría" primero |

## Qué necesito de ti para la Fase 0

No pegues credenciales en el chat: guárdalas tú en `.env.local` (ignorado por git) con las variables de
`.env.example`, y dime solo que están.

1. **Firebase**: ¿usamos los proyectos existentes `gdg-es-develop` (staging) y `gdg-es` (producción), a
   los que desplegaba la web anterior? Id del proyecto, config de la app web (es pública) y el JSON de una cuenta de servicio
   con permisos de Firestore, Auth y Storage (va a `.env.local`).
2. **Región de Firestore** elegida (propuesta: `europe-southwest1`, Madrid). No se puede cambiar después.
3. **Google Maps**: las dos claves (navegador y Geocoding) con sus restricciones y un Map ID.
4. **GitHub**: tu usuario (para `CODEOWNERS`) y acceso de administración al repo para proteger ramas y
   añadir secretos de Actions.
5. **Horas por semana** que puedes dedicar, para ajustar el recorte del MoSCoW.

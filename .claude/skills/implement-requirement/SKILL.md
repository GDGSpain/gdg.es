---
name: implement-requirement
description: Implementar en código (Next.js/Firebase/Google Maps/sync) un requisito funcional ya documentado de GDG.es. Usar cuando el usuario pida codificar, implementar o desarrollar un RF existente. Requiere confirmación explícita antes de escribir código.
---

# Implementar Requisito Funcional

## ⚠️ Reglas críticas

- **No escribir código sin confirmación explícita del usuario.** Proponer plan primero, esperar "sí"/"adelante".
- **Commits**: los gestiona el usuario; no commitear. Dejar los cambios en el working tree.

## Proceso

1. Verificar que el RF existe en `docs/reqs/<DOMINIO>/`, está completo y sin "Pendiente de decidir"
   abierto. Si queda alguno, preguntarlo antes.
2. Verificar que sus dependencias (otros RF) ya están implementadas.
3. Consultar `docs/context/` (buscar lo concreto): `data-model.md` (¿existe la tabla/columna?),
   `api.md` (¿hay una ruta parecida?, ¿qué auth usan sus vecinas?), `glossary.md`.
4. Buscar en `src/shared/` si ya existe algo reutilizable. Si lo nuevo sirve a más de un dominio, va en
   `shared/`.
5. Proponer plan:
   ```
   RF-CHAPTERS-002: Ficha de capítulo

   Impactará:
   - src/app/capitulos/[slug]/page.tsx — render de la ficha
   - src/modules/chapters/get-chapter.service.ts — caso de uso (Result)
   - src/modules/chapters/ports/chapter-repository.port.ts — puerto
   - src/infrastructure/firestore/chapter-repository.adapter.ts — adaptador
   - src/modules/chapters/get-chapter.service.test.ts — tests con fakes

   Reutiliza: src/shared/result.ts

   ¿Proceder?
   ```
6. Esperar confirmación.
7. Implementar solo lo confirmado, con los estándares de abajo.
8. Si cambió el esquema o una ruta: `npm run context`.
9. Al terminar, actualizar el RF: casillas de `Estado` (`Tests pasando` solo si están en verde) y la
   sección `Implementación` con los ficheros creados/modificados.

## Ubicación

| Qué | Dónde |
|---|---|
| Página / route handler | `src/app/…` (solo traduce HTTP/render ↔ caso de uso) |
| Caso de uso | `src/modules/<dominio>/*.service.ts` → `Result<T,E>` |
| Esquemas zod | `src/modules/<dominio>/*.schema.ts` |
| Puertos | `src/modules/<dominio>/ports/*.port.ts` (lenguaje de dominio, no espejo del SDK de Firebase) |
| Adaptadores | `src/infrastructure/{firestore,gdg-source,firebase-auth,google-maps,storage}/` |
| Importadores | `src/sync/` (usan casos de uso; fixtures en `src/sync/__fixtures__/`) |
| Modelo de datos | `db/schemas/` (zod), `db/firestore.indexes.json`, `db/firestore.rules` |

## Estándares de código

- **Trazabilidad**: cabecera con el/los RF que implementa (`/** RF-SYNC-002, RF-SYNC-003: … */`).
- **Documentación en español** (TSDoc en clases y funciones públicas).
- **TypeScript estricto**, sin `any`. Entradas validadas con zod en el borde.
- **Casos de uso** reciben puertos por parámetro y devuelven `Result<T,E>`; nunca importan `firebase-admin`.
- **Firestore** solo desde el servidor; el navegador solo usa Firebase Auth para el login (AGENTS.md regla 7).
- **Google Maps**: componentes `"use client"` cargados solo en las páginas con mapa; datos ya filtrados por el servidor.
- **Componentes**: Server Components por defecto; `"use client"` solo para interacción (mapa, filtros).
- **Tests**: cada caso de uso nuevo con su test con fakes en la misma tanda (o delegar en `test-writer`).
- **Sync**: idempotente (upsert por `sourceId`), nunca pisa campos propios, respeta lo oculto.

## Abortar si

- RF no documentado o con preguntas abiertas
- Dependencias incompletas
- Usuario no confirma

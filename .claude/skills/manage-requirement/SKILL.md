---
name: manage-requirement
description: Crear, verificar conflictos y revisar requisitos funcionales (RF) en docs/reqs/. Usar cuando el usuario proponga, pida crear, o modifique un requisito funcional del proyecto GDG.es.
---

# Gestionar Requisito Funcional

## Proceso

1. **Validar dominio**: comprobar que `<DOMINIO>` es una carpeta ya existente en `/docs/reqs/` (SYNC, CHAPTERS, ORGANIZERS, EVENTS, MAP, SPONSORS, AUTH, ADMIN). Si no existe, preguntar si es un dominio nuevo o error de nombre — nunca crearlo por cuenta propia.
2. **Buscar existentes**: leer primero el `README.md` del dominio (índice de una línea por RF) para descartar duplicados obvios. Solo abrir el `.md` completo de un RF concreto si el título/índice sugiere posible solapamiento o si hace falta revisar sus criterios de aceptación en detalle. Si algún RF ya está en el contexto de esta conversación, no releerlo — usar lo ya cargado. Para detectar solapamientos que no salen por el título, buscar los términos del RF en `docs/context/glossary.md` (¿"capítulo" o "ciudad"?, ¿sponsor compartido o de evento?) y las tablas que tocaría en `docs/context/data-model.md` (si ya existe).
3. **Verificar conflictos** (también con las decisiones de `docs/adr/`: un RF que las contradiga se señala como conflicto de arquitectura):
   - ¿Duplicado? (mismo RF ya existe)
   - ¿Incompatible? (otro RF dice lo contrario)
   - ¿Dependencia rota? (requiere un RF que no existe)
   - Si hay duda → PREGUNTAR, nunca asumir ni resolver por cuenta propia
4. **Revisar calidad** (si se está creando):
   - Descripción clara, no ambigua
   - Mínimo 3 criterios de aceptación medibles
   - Módulos afectados listados (Frontend/Backend/Database)
   - Dependencias y conflictos explícitos
   - Un RF = una característica (si es muy grande, dividir)
   - Si algún punto no está claro → PREGUNTAR al usuario, nunca rellenar por cuenta propia
5. **Chequeo de usabilidad/diseño** (RF que definan pantallas o flujos de UI):
   - ¿Tiene sentido esa pantalla/flujo tal cual, o hay una alternativa que **mejore la usabilidad**? (p.ej. combinar pasos, mover un campo a otro momento del flujo, reducir fricción, un patrón más estándar)
   - ¿La pantalla quedaría **desangelada** (poco contenido, mucho espacio vacío) o sobrecargada? Si es así, proponerlo (móvil primero; el directorio y el mapa son las pantallas clave).
   - Estas observaciones se **plantean al usuario como propuesta**, no se imponen ni se dan por hechas: él decide.
6. **Crear archivo** (solo si todo lo anterior está resuelto)
   - Ruta: `docs/reqs/<DOMINIO>/RF-<DOMINIO>-NNN.md`
   - Template: `docs/reqs/TEMPLATE.md`

## Los RF reflejan el estado actual, no el historial

Un RF describe **cómo es hoy** la funcionalidad. Al cambiarla (por revisión, petición del usuario o
rediseño), se **reescriben** las secciones afectadas — Descripción, Criterios de Aceptación, Notas
Técnicas, Implementación — para que digan la verdad actual. **Nunca** se añaden secciones "Revisión — …"
al final ni notas "antes era X, ahora Y" a modo de parche: el historial ya está en git. Si algo se
descartó a propósito y conviene no reintroducirlo, basta una línea en Notas Técnicas con la decisión
vigente (no la cronología).

## Formato de salida ante conflicto

```
⚠️ Conflicto encontrado:
- RF-AUTH-001: "Inicio de sesión con Google"
- Nueva propuesta: "Registro con email y contraseña"

¿Modificar RF-AUTH-001? ¿Crear RF paralelo? ¿Cambiar propuesta?
```

## Regla de oro

Nunca crear ni modificar un RF sin haber comprobado conflictos primero. Ante cualquier duda sobre un requisito funcional (dominio, contenido, conflicto, calidad), preguntar al usuario — nunca asumir.

## Específico de GDG.es

- Un RF que toque datos de la fuente debe decir **qué campos** importa y si son de origen o propios
  (glosario): el sync sobrescribe los de origen y nunca los propios.
- Un RF que publique datos de personas se contrasta con AGENTS.md regla 7 y `docs/legal/`.
- Las preguntas abiertas van en "Notas Técnicas → **Pendiente de decidir**" y se borran al resolverse.
- Al crear un RF, añadir su línea al `README.md` del dominio.

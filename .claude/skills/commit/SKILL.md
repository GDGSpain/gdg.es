---
name: commit
description: Preparar y crear commits de gdg.es con Conventional Commits en la rama de trabajo — agrupa los cambios por intención, valida lint/typecheck/tests y escribe el mensaje en español citando el RF. Usar cuando el usuario pida commitear, guardar el trabajo o al terminar un RF.
---

# Crear commits

## Reglas

- Solo en ramas de trabajo (`feat/…`, `fix/…`, `docs/…`, `refactor/…`, `ci/…`). Si la rama actual es
  `develop` o `master`, **parar** y proponer crear una rama.
- Nunca `git push`, `--force`, `reset --hard`, `rebase` ni `--no-verify` sin confirmación explícita.
- Nunca commitear secretos: revisar que no entren `.env*` (salvo `.env.example`), JSON de cuentas de
  servicio ni claves.
- No commitear `legacy/` salvo que el cambio sea expresamente sobre él.

## Proceso

1. `git status` y `git diff` (staged y sin stagear) para entender qué cambió.
2. **Agrupar por intención**: un commit = un cambio con sentido propio (p. ej. el caso de uso y su test
   juntos; la documentación del RF en el mismo commit que su código; la config de CI aparte). Si hay
   varias intenciones, proponer la división.
3. Comprobar antes de commitear (lo mismo que el pre-commit):
   `npm run lint && npm run typecheck && npm test`. Si cambió el esquema o una ruta, `npm run context`.
   Si algo falla, arreglarlo o avisar; no saltarse el hook.
4. Escribir el mensaje:
   ```
   <tipo>(<ámbito>): <resumen en minúscula, imperativo, sin punto> (RF-XXX-NNN)

   <cuerpo opcional: el porqué, no el qué; líneas ≤ 100>

   Co-Authored-By: …   ← las líneas de atribución que indique el entorno, si las hay
   ```
   - Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `chore`, `style`, `revert`.
   - Ámbitos (`commitlint.config.mjs`): `sync`, `chapters`, `organizers`, `events`, `map`, `sponsors`,
     `auth`, `admin`, `web`, `db`, `ci`, `docs`, `deps`, `legacy`, `design`.
   - `feat` → versión menor, `fix` → parche, `!` o `BREAKING CHANGE:` → mayor (release-please).
5. `git add <ficheros concretos>` (no `git add -A` a ciegas) y `git commit -F -` con el mensaje.
6. Mostrar `git log --oneline -5` y resumir. Recordar que el push lo confirma el usuario.

## Ejemplos

```
feat(sync): importar capítulos de España (RF-SYNC-002)
fix(map): agrupar eventos en la misma ubicación (RF-MAP-002)
docs(adr): aceptar el método de extracción de la fuente
ci: ejecutar los emuladores de firebase en los tests
```

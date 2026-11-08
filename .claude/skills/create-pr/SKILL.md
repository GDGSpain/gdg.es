---
name: create-pr
description: Preparar una pull request de gdg.es contra develop — comprueba CI local, RF actualizados y redacta título y descripción con la plantilla. Usar cuando el usuario pida abrir una PR o subir la rama. Requiere confirmación antes de hacer push o crear la PR.
---

# Crear pull request

1. Rama de trabajo con commits por delante de `origin/develop` (`git log origin/develop..HEAD --oneline`).
2. Comprobar: `npm run lint && npm run typecheck && npm test && npm run build`.
3. Si el diff toca auth, Firestore, el panel o el sync: pasar el subagente `security-reviewer`.
4. Comprobar que cada RF afectado tiene `Estado` e `Implementación` al día.
5. Redactar:
   - **Título**: como un commit Conventional (`feat(chapters): directorio y ficha de capítulo`).
   - **Cuerpo**: `.github/pull_request_template.md` relleno (qué cambia, RF, checklist, cómo probarlo).
6. **Pedir confirmación** mostrando título, cuerpo y la lista de commits.
7. Con el sí: `git push -u origin <rama>` y `gh pr create --base develop --title … --body-file …`.
   Si no hay credenciales en este entorno, dejar el título y el cuerpo listos para que el usuario la abra.
8. Tras abrirla, vigilar el CI (`gh pr checks`) y avisar de fallos.

Nunca fusionar la PR ni empujar a `develop`/`master`: lo decide el usuario.

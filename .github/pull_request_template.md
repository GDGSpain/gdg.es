## Qué cambia

<!-- Una o dos frases. Enlaza el RF: docs/reqs/<DOMINIO>/RF-<DOMINIO>-NNN.md -->

RF:

## Checklist

- [ ] El RF existe y sus secciones **Estado** e **Implementación** están al día
- [ ] Tests de la capa tocada (casos de uso con fakes · importadores con fixtures · e2e si toca un flujo crítico)
- [ ] `npm run lint && npm run typecheck && npm test` en verde
- [ ] Sin secretos ni `.env` en el diff
- [ ] Si cambia el esquema o una ruta: `docs/context/` regenerado (`npm run context`)
- [ ] Si trata datos personales nuevos: `docs/legal/` actualizado
- [ ] Commits con Conventional Commits

## Cómo probarlo

<!-- Pasos manuales, capturas si hay UI -->

#!/bin/sh
# Regenera docs/context (ADR-0007) y para el commit si ha cambiado, para que entre en él.
# Hasta que exista el script `context` en package.json no hace nada.
if ! npm run | grep -q "^  context$"; then
  exit 0
fi
npm run context --silent || exit 1
if ! git diff --quiet -- docs/context; then
  echo "docs/context estaba desfasado: regenerado. Añádelo (git add docs/context) y repite el commit."
  exit 1
fi

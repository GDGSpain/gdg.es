# App Polymer anterior de gdg.es (2016–2020)

Código de la web de GDG Spain hecha con Polymer 1/2, Bower y polymer-cli, que se desplegaba en Firebase
Hosting (`gdg-es-develop` desde `develop`, `gdg-es` desde `master`). Se conserva aquí como referencia
mientras se construye la nueva app en la raíz del repositorio (TFM, rama `feat/tfm-directorio`).

- `data/groups.json`: 34 GDG de España con ciudad y redes. Sirve de **semilla** y para contrastar la
  importación desde gdg.community.dev (RF-SYNC-002).
- `data/images/cities/`: fotos de las ciudades, reutilizables en las fichas de capítulo.
- `ci-legacy.yml`: el workflow de GitHub Actions anterior (lint, build y despliegue a Firebase Hosting).
  Ya no se ejecuta: el nuevo está en `.github/workflows/`.

No se mantiene: no tiene CI ni dependencias actualizadas. Su `package.json` y `package-lock.json` se
retiraron (2026-11-17) porque Dependabot marcaba decenas de vulnerabilidades de esas dependencias de 2016
que ya no se instalan ni se despliegan. Si hace falta volver a ejecutarla, se recuperan del historial:
`git show 91b7ab3:package.json` y `git show 91b7ab3:package-lock.json`. Se borrará cuando la nueva app esté en producción.

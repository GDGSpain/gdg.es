# Firebase Hosting

Carpeta pública de Firebase Hosting. `firebase.json` redirige (302) todas las rutas de
`https://gdg-es-develop.web.app` a la URL del backend de App Hosting (`gdg-es-web`), que es quien sirve la
web Next.js. Ver `docs/tech/deploy.md`.

`index.html` y `404.html` son un respaldo: si la redirección no se aplicara, llevan con JavaScript a la misma
ruta en App Hosting.

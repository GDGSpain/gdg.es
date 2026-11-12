# Cómo contribuir a gdg.es

El equipo de GDG Spain agradece las contribuciones de la comunidad. Las reglas completas están en
[`AGENTS.md`](AGENTS.md), que vale igual para personas y agentes.

- **Bugs e ideas**: abre un issue describiendo el problema y, si puedes, el enfoque de solución.
- **Pull requests**: desde un fork o una rama, contra `develop`, enlazando el issue o el RF.

## 1. Preparar el entorno

Requisitos: **Node 22+**, Git, **Firebase CLI** (`npm i -g firebase-tools`) y Java 21 (para los
emuladores). Acceso al proyecto de Firebase **DEV** (`gdg-es-develop`) concedido por el titular; en local
se usan los emuladores o las credenciales de usuario (`gcloud auth application-default login`), nunca PRO
(ver [`docs/tech/firebase.md`](docs/tech/firebase.md)).

```bash
npm install                  # dependencias y hooks de git (lefthook + commitlint)
cp .env.example .env.local   # y rellena las variables (nunca se suben)
npm run dev                  # web en http://localhost:3000
```

Firestore y el sync en local (emuladores; necesitan Java 21):

```bash
npm run emulators            # Firestore :8080, Auth :9099, interfaz en http://localhost:4000
npm run sync                 # importa los capítulos de España en el emulador (FIRESTORE_EMULATOR_HOST)
npm run test:emulator        # tests de los adaptadores de Firestore contra el emulador
```

Sin `FIRESTORE_EMULATOR_HOST` en `.env.local`, `npm run sync` escribe en DEV. Nunca contra PRO.

## 2. Antes de escribir código

1. **Todo cambio parte de un requisito** (`docs/reqs/<DOMINIO>/RF-<DOMINIO>-NNN.md`). Si no existe, se crea
   primero con `docs/reqs/TEMPLATE.md`, comprobando en el `README.md` del dominio que no está duplicado.
2. Mira [`docs/context/`](docs/context/README.md) y [`docs/adr/`](docs/adr/README.md). Si tu cambio
   contradice un ADR, se escribe uno nuevo que lo reemplace.
3. Rama desde `develop`: `feat/…`, `fix/…`, `docs/…`, `refactor/…`, `ci/…`.

## 3. Mientras programas

- Página/route handler → caso de uso (`Result<T,E>`) → puerto → adaptador.
- Cita el RF en la cabecera de cada fichero nuevo. Comentarios y documentación en español.
- Antes de subir: `npm run lint` · `npm run typecheck` · `npm test`.
- Si cambias el esquema o una ruta: `npm run context` para regenerar `docs/context/`.

## 4. Commits

`tipo(ámbito): resumen en minúscula`. Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `ci`,
`build`, `chore`, `style`, `revert`. Ámbito: dominio del RF o área.

```
feat(sync): importar capítulos de España (RF-SYNC-002)
fix(map): agrupar marcadores en la misma ubicación
docs(adr): método de extracción de datos
```

## 5. Pull request

- PR a `develop` con la plantilla: RF afectado, tests, `docs/context` regenerado. CI en verde.
- Al fusionar en `develop` se despliega en DEV; producción solo al final (ver
  [`docs/tech/deploy.md`](docs/tech/deploy.md)).
- Cambios en auth, base de datos, panel o sincronización: revisión de seguridad antes (subagente
  `security-reviewer`).
- Al terminar, actualiza el RF: casillas de `Estado` y ficheros que lo implementan.

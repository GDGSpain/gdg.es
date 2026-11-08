# Firebase y GCP: entornos

Dos proyectos de Firebase, heredados de la web anterior y reutilizados (ADR-0011). Alias en `.firebaserc`.

| | **DEV** (staging) | **PRO** (producción) |
|---|---|---|
| Nombre | GDG Spain - develop | GDG Spain - production |
| ID | `gdg-es-develop` | `gdg-es` |
| Número | 1004139288103 | 21427921896 |
| Consola | <https://console.firebase.google.com/project/gdg-es-develop/> | <https://console.firebase.google.com/project/gdg-es/> |
| Alias en `.firebaserc` | `default`, `staging` | `production` |
| Rama que despliega | `develop` (automático) | `master` (manual, con aprobación) |
| Estado | **En uso**: aquí se despliega todo durante el desarrollo | **Congelado** hasta el paso a producción (ver `deploy.md`) |

## Regla de entornos

- Todo despliegue, prueba con datos reales y sync programado se hace en **DEV**.
- **PRO no se toca** (ni consola, ni reglas, ni datos) hasta que el producto esté completo y se ejecute
  la checklist de paso a producción de [`deploy.md`](deploy.md). Hasta entonces gdg.es sigue sirviendo
  lo que haya hoy en el Hosting clásico de `gdg-es`.
- Los dos entornos se configuran **igual** (mismos servicios, región, roles y nombres de secretos): lo
  que se valida en DEV es lo que se replica en PRO.

## Configuración por entorno

Mismo checklist para los dos. DEV ahora; PRO al pasar a producción.

| # | Qué | Dónde | DEV | PRO |
|---|---|---|---|---|
| 1 | Plan **Blaze** con cuenta de facturación (App Hosting, Scheduler, Secret Manager y Maps lo exigen) | Consola → Uso y facturación | [ ] | [ ] |
| 2 | **Presupuesto y alertas** (p. ej. 20 € DEV / 50 € PRO, avisos al 50/90/100 %) | GCP → Facturación → Presupuestos | [ ] | [ ] |
| 3 | **Firestore** modo nativo, base `(default)`, región `europe-southwest1` (Madrid). La región no se puede cambiar | Firestore Database | [ ] | [ ] |
| 4 | **Authentication**: proveedor Google activo; dominios autorizados: `localhost`, dominio de App Hosting y dominio propio | Authentication → Sign-in method / Settings | [ ] | [ ] |
| 5 | **Storage**: bucket por defecto en la misma región | Storage | [ ] | [ ] |
| 6 | **App web** registrada (su `firebaseConfig` es pública) | Configuración del proyecto → Tus apps | [ ] | [ ] |
| 7 | **APIs de Maps**: Maps JavaScript API y Geocoding API | GCP → APIs y servicios | [ ] | [ ] |
| 8 | **Claves de Maps**: navegador (referrers del entorno, solo Maps JS) y servidor (solo Geocoding) + **Map ID** | GCP → Credenciales / Google Maps Platform → Map management | [ ] | [ ] |
| 9 | **App Hosting**: backend `gdg-es-web` en `europe-west4`, conectado a GitHub `GDGSpain/gdg.es` | App Hosting | [ ] | [ ] |
| 10 | **Secret Manager**: `SYNC_SECRET`, `GOOGLE_GEOCODING_API_KEY` (se crean con `firebase apphosting:secrets:set`) | Secret Manager | [ ] | [ ] |
| 11 | **Cloud Scheduler**: job diario `POST /api/sync/run` (cuando exista RF-SYNC-005) | Cloud Scheduler | [ ] | [ ] |
| 12 | **CI sin claves** (Workload Identity Federation): pool `github`, proveedor limitado al repo `GDGSpain/gdg.es`, cuenta `github-deployer@…` con roles mínimos (ver abajo) | IAM → Workload Identity Federation | [ ] | [ ] |
| 13 | **Acceso del equipo**: Rei como propietario; nadie más con rol de propietario en PRO | IAM | [ ] | [ ] |

### Roles de la cuenta de CI (`github-deployer`)

Solo lo que despliega el workflow: `Firebase Rules Admin` (reglas e índices de Firestore y Storage),
`Cloud Datastore Index Admin`, `Firebase App Hosting Admin` (crear rollouts), `Service Account User`
sobre la cuenta de ejecución de App Hosting. Nada de `Owner` ni `Editor`.

## Credenciales en local

- **Sin claves JSON**: en local se usan las Application Default Credentials del usuario
  (`gcloud auth application-default login`) contra **DEV**, o los **emuladores** (lo habitual para
  desarrollar y para los tests).
- La config pública de la app web y las claves de Maps de DEV van en `.env.local` (ignorado por git).
- En App Hosting el Admin SDK usa la cuenta de ejecución del backend: tampoco hay claves.
- Nunca se usan credenciales de PRO en local.

## Lo que ya existe en los proyectos

La web anterior (Polymer) desplegaba en **Firebase Hosting clásico** de ambos proyectos. Antes de tocar
nada hay que anotar aquí:

- [ ] DEV: qué sirve hoy el Hosting y si había Firestore, Auth o Storage creados (y en qué región).
- [ ] PRO: lo mismo, más dónde está el DNS de `gdg.es` y a qué apunta.

# ADR-0011: Firebase App Hosting para la web y Cloud Scheduler para el sync

- **Estado**: Aceptada para DEV (despliegue manual); automático desde `develop` y Cloud Scheduler pendientes
- **Fecha**: 2026-10-27 · actualizada 2026-11-09
- **RF relacionados**: RF-SYNC-005

## Contexto

La web es Next.js con renderizado en servidor y el sync tiene que ejecutarse de forma programada. Todo lo
demás (Firestore, Auth, Maps) ya está en el mismo proyecto de GCP. La web anterior desplegaba en
Firebase Hosting clásico a dos proyectos: `gdg-es-develop` (desde `develop`) y `gdg-es` (desde `master`).

## Decisión propuesta

- **Firebase App Hosting** despliega la app Next.js (Cloud Run por debajo), reutilizando los dos
  proyectos existentes (alias en `.firebaserc`): `gdg-es-develop` (DEV) desde `develop` y `gdg-es` (PRO)
  desde `master`.
- **Durante el desarrollo solo se despliega en DEV.** PRO queda congelado y se configura y despliega una
  sola vez, cuando el producto esté completo, siguiendo la checklist de `docs/tech/deploy.md`.
- Reglas e índices de Firestore/Storage se despliegan desde GitHub Actions con **Workload Identity
  Federation** (sin claves en GitHub); environment `production` con aprobación obligatoria.
- **Cloud Scheduler** llama una vez al día a `POST /api/sync/run`, protegido con `SYNC_SECRET` (o con
  token OIDC de una cuenta de servicio). El mismo caso de uso lo dispara el botón del panel.
- Secretos en **Cloud Secret Manager**, referenciados desde `apphosting.yaml`.
- Backend `gdg-es-web` en `europe-west4`. Mientras no esté conectado a GitHub se despliega desde el código
  local (`firebase deploy --only apphosting`). **Firebase Hosting** redirige `gdg-es-develop.web.app` al
  backend (una reescritura da 403 porque el Cloud Run de App Hosting no admite tráfico de otro origen). Los
  dominios propios (`gdg.es` en PRO) se conectan directamente al backend de App Hosting.
- El proyecto lo toma la app de `GOOGLE_CLOUD_PROJECT`, así un mismo `apphosting.yaml` vale para DEV y PRO.

## Alternativas

- **Vercel + GitHub Actions como cron**: buen soporte de Next.js, pero saca la app de GCP.
- **Cloud Functions programadas para el sync**: separa el sync del resto del código; se puede adoptar si
  el sync supera el tiempo máximo de una petición.

## Consecuencias

- Un solo proyecto, una sola factura y los secretos en un único sitio.
- El sync debe terminar dentro del timeout de la petición; si no, se parte por capítulos o pasa a una
  Cloud Function.

/**
 * RF-SYNC-002, ADR-0008: acceso a Firestore con el Admin SDK, solo en el servidor.
 *
 * Credenciales (docs/tech/firebase.md): si hay `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY` se usan;
 * si no, las Application Default Credentials (ADC en local, cuenta de ejecución en App Hosting). Con
 * `FIRESTORE_EMULATOR_HOST` definido, el SDK habla con el emulador.
 */
import { cert, getApps, initializeApp, applicationDefault, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { AppConfig } from "@/shared/config/config";

const APP_NAME = "gdg-es-server";

/**
 * Devuelve la app de Firebase Admin, creándola una sola vez.
 * @param config configuración validada
 */
export function getAdminApp(config: AppConfig): App {
  const existing = getApps().find((a) => a.name === APP_NAME);
  if (existing) return existing;
  const projectId =
    config.FIREBASE_PROJECT_ID ?? (config.FIRESTORE_EMULATOR_HOST ? "demo-gdg-es" : undefined);
  const credential =
    config.FIREBASE_CLIENT_EMAIL && config.FIREBASE_PRIVATE_KEY
      ? cert({
          projectId,
          clientEmail: config.FIREBASE_CLIENT_EMAIL,
          privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        })
      : config.FIRESTORE_EMULATOR_HOST
        ? undefined
        : applicationDefault();
  return initializeApp({ projectId, ...(credential ? { credential } : {}) }, APP_NAME);
}

/**
 * Firestore del servidor.
 * @param config configuración validada
 */
export function getServerFirestore(config: AppConfig): Firestore {
  return getFirestore(getAdminApp(config));
}

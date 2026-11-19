/** Tests de la configuración validada (AGENTS.md regla 6). */
import { describe, expect, it } from "vitest";
import { loadConfig } from "./config";

describe("loadConfig", () => {
  it("en desarrollo arranca sin credenciales de Firebase", () => {
    const config = loadConfig({ NODE_ENV: "development" });
    expect(config.FIREBASE_PROJECT_ID).toBeUndefined();
    expect(config.SYNC_USER_AGENT).toBe("gdg.es-directory");
  });

  it("en producción no exige claves ni proyecto (App Hosting usa su cuenta de ejecución)", () => {
    const config = loadConfig({ NODE_ENV: "production" });
    expect(config.FIREBASE_CLIENT_EMAIL).toBeUndefined();
    expect(config.FIREBASE_PROJECT_ID).toBeUndefined();
  });

  it("toma el proyecto de FIREBASE_CONFIG (App Hosting) y tolera un JSON roto", () => {
    expect(loadConfig({ FIREBASE_CONFIG: '{"projectId":"gdg-es-develop"}' }).FIREBASE_PROJECT_ID).toBe(
      "gdg-es-develop",
    );
    expect(loadConfig({ FIREBASE_CONFIG: "{roto" }).FIREBASE_PROJECT_ID).toBeUndefined();
  });

  it("toma el proyecto de GOOGLE_CLOUD_PROJECT si no se indica (App Hosting)", () => {
    expect(
      loadConfig({ NODE_ENV: "production", GOOGLE_CLOUD_PROJECT: "gdg-es-develop" }).FIREBASE_PROJECT_ID,
    ).toBe("gdg-es-develop");
    expect(
      loadConfig({ FIREBASE_PROJECT_ID: "otro", GOOGLE_CLOUD_PROJECT: "gdg-es-develop" }).FIREBASE_PROJECT_ID,
    ).toBe("otro");
  });

  it("rechaza una cuenta de servicio a medias", () => {
    expect(() => loadConfig({ FIREBASE_CLIENT_EMAIL: "x@y.iam.gserviceaccount.com" })).toThrow(/van juntas/);
  });

  it("trata las variables vacías como ausentes", () => {
    expect(loadConfig({ FIREBASE_PROJECT_ID: "  " }).FIREBASE_PROJECT_ID).toBeUndefined();
  });

  it("normaliza ADMIN_EMAILS a una lista en minúsculas", () => {
    expect(loadConfig({ ADMIN_EMAILS: " Ana@GDG.es, ,luis@gdg.es" }).ADMIN_EMAILS).toEqual([
      "ana@gdg.es",
      "luis@gdg.es",
    ]);
  });

  it("usa la base de datos (default) salvo que se indique otra", () => {
    expect(loadConfig({}).FIRESTORE_DATABASE_ID).toBe("(default)");
    expect(loadConfig({ FIRESTORE_DATABASE_ID: "gdg-es" }).FIRESTORE_DATABASE_ID).toBe("gdg-es");
  });

  it("rechaza un email de administración mal formado", () => {
    expect(() => loadConfig({ ADMIN_EMAILS: "no-es-un-email" })).toThrow(/Configuración inválida/);
  });
});

/** Tests de la configuración validada (AGENTS.md regla 6). */
import { describe, expect, it } from "vitest";
import { loadConfig } from "./config";

describe("loadConfig", () => {
  it("en desarrollo arranca sin credenciales de Firebase", () => {
    const config = loadConfig({ NODE_ENV: "development" });
    expect(config.FIREBASE_PROJECT_ID).toBeUndefined();
    expect(config.SYNC_USER_AGENT).toBe("gdg.es-directory");
  });

  it("en producción exige las credenciales del Admin SDK", () => {
    expect(() => loadConfig({ NODE_ENV: "production", FIREBASE_PROJECT_ID: "gdg-es" })).toThrow(
      /FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY/,
    );
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

  it("rechaza un email de administración mal formado", () => {
    expect(() => loadConfig({ ADMIN_EMAILS: "no-es-un-email" })).toThrow(/Configuración inválida/);
  });
});

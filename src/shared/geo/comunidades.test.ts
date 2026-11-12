/** RF-SYNC-002: normalización de la región de gdg.community.dev a comunidad autónoma. */
import { describe, expect, it } from "vitest";
import seed from "@db/seed/chapters-es.json";
import { COMUNIDADES, comunidadPorId, normalizarComunidad } from "./comunidades";

describe("normalizarComunidad", () => {
  it("reconoce todas las regiones de los capítulos de la semilla", () => {
    const sinReconocer = seed.chapters
      .filter((c) => normalizarComunidad(c.state) === null)
      .map((c) => c.state);
    expect(sinReconocer).toEqual([]);
  });

  it.each([
    ["Andalusia", "AN"],
    ["AN", "AN"],
    ["Community of Madrid", "MD"],
    ["Madrid", "MD"],
    ["Castille and León", "CL"],
    ["CL", "CL"],
    ["Balearic Islands", "IB"],
    ["Valencia", "VC"],
    ["Catalonia", "CT"],
    ["CN", "CN"],
    ["  galicia ", "GA"],
  ])("'%s' → %s", (state, id) => {
    expect(normalizarComunidad(state)?.id).toBe(id);
  });

  it("devuelve null para una región desconocida o vacía", () => {
    expect(normalizarComunidad("Île-de-France")).toBeNull();
    expect(normalizarComunidad("")).toBeNull();
    expect(normalizarComunidad(null)).toBeNull();
    expect(normalizarComunidad("ZZ")).toBeNull();
  });

  it("incluye las 17 comunidades y las 2 ciudades autónomas", () => {
    expect(COMUNIDADES).toHaveLength(19);
    expect(comunidadPorId("ML")?.nombre).toBe("Melilla");
  });
});

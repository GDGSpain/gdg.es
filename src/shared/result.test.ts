/** Tests de `Result` (ADR-0006). */
import { describe, expect, it } from "vitest";
import { err, map, ok } from "./result";

describe("Result", () => {
  it("map transforma el valor de un éxito", () => {
    expect(map(ok(2), (n) => n * 3)).toEqual({ ok: true, value: 6 });
  });

  it("map deja pasar el fallo sin ejecutar la transformación", () => {
    let called = false;
    const result = map(err("no-encontrado"), () => {
      called = true;
      return 1;
    });
    expect(result).toEqual({ ok: false, error: "no-encontrado" });
    expect(called).toBe(false);
  });
});

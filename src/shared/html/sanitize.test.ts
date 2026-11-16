/** RF-CHAPTERS-002: el HTML de la fuente se sanea antes de mostrarlo. */
import { describe, expect, it } from "vitest";
import { sanitizeSourceHtml } from "./sanitize";

describe("sanitizeSourceHtml", () => {
  it("quita scripts, manejadores de eventos y estilos", () => {
    const out = sanitizeSourceHtml(
      '<p onclick="x()" style="color:red">Hola<script>alert(1)</script></p><img src=x onerror=alert(1)>',
    );
    expect(out).toBe("<p>Hola</p>");
  });

  it("no permite enlaces javascript:", () => {
    expect(sanitizeSourceHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
  });

  it("abre los enlaces en pestaña nueva sin dar acceso a la página de origen", () => {
    expect(sanitizeSourceHtml('<a href="https://discord.gg/abc">Discord</a>')).toBe(
      '<a href="https://discord.gg/abc" target="_blank" rel="noopener noreferrer nofollow">Discord</a>',
    );
  });

  it("conserva el formato básico y quita párrafos vacíos", () => {
    expect(sanitizeSourceHtml("<div>Grupo <strong>abierto</strong><br></div><p>&nbsp;</p>")).toBe(
      "<div>Grupo <strong>abierto</strong><br /></div>",
    );
  });
});

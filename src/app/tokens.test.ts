/**
 * Tokens de diseño (docs/design/README.md): los pares texto/fondo semánticos cumplen el contraste
 * WCAG 2.2 AA en modo claro y oscuro. Si alguien cambia un color y rompe el contraste, falla aquí.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const css = readFileSync(fileURLToPath(new URL("./tokens.css", import.meta.url)), "utf8");

/** Extrae las custom properties de un bloque de CSS. */
function declarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

const lightBlock = css.slice(css.indexOf(":root {"), css.indexOf("@media (prefers-color-scheme: dark)"));
const darkBlock = css.slice(
  css.indexOf("@media (prefers-color-scheme: dark)"),
  css.indexOf("@media (prefers-reduced-motion"),
);
const light = declarations(lightBlock);
const dark = { ...light, ...declarations(darkBlock) };

/** Resuelve `var(--x)` hasta un color hexadecimal. */
function resolve(tokens: Record<string, string>, name: string): string {
  let value = tokens[name];
  for (let i = 0; i < 10 && value?.startsWith("var("); i++) value = tokens[value.slice(4, -1).trim()];
  if (!value || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`${name} no resuelve a un hex: ${value}`);
  return value;
}

/** Luminancia relativa WCAG de un color hex. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste WCAG entre dos colores. */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS: Array<[texto: string, fondo: string, minimo: number]> = [
  ["--color-text", "--color-bg", 4.5],
  ["--color-text", "--color-surface", 4.5],
  ["--color-text-muted", "--color-bg", 4.5],
  ["--color-text-muted", "--color-surface", 4.5],
  ["--color-text-muted", "--color-surface-muted", 4.5],
  ["--color-link", "--color-bg", 4.5],
  ["--color-text-on-action", "--color-action", 4.5],
  ["--color-text-on-action", "--color-action-hover", 4.5],
  ["--color-border-strong", "--color-bg", 3], // bordes de controles (WCAG 1.4.11)
];

describe.each([
  ["claro", light],
  ["oscuro", dark],
])("contraste en modo %s", (_modo, tokens) => {
  it.each(PAIRS)("%s sobre %s llega al mínimo", (texto, fondo, minimo) => {
    expect(contrast(resolve(tokens, texto), resolve(tokens, fondo))).toBeGreaterThanOrEqual(minimo);
  });
});

describe("decisiones respecto a gdg.community.dev", () => {
  it("el hover de la web original (#4285f4 con texto blanco) no llega a AA y por eso no se usa", () => {
    expect(contrast("#ffffff", "#4285f4")).toBeLessThan(4.5);
    expect(resolve(light, "--color-action-hover")).not.toBe("#4285f4");
  });
});

/** RF-SYNC-001, ADR-0005: interpretación del robots.txt real de gdg.community.dev. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isAllowed, parseRobots } from "./robots";

const robots = readFileSync(new URL("../../sync/__fixtures__/robots.txt", import.meta.url), "utf8");

describe("robots.txt de la fuente", () => {
  const rules = parseRobots(robots);

  it("prohíbe la API y los perfiles", () => {
    expect(isAllowed("/api/chapter_region/?chapters=true", rules)).toBe(false);
    expect(isAllowed("/u/abc123/", rules)).toBe(false);
  });

  it("permite páginas de capítulo, de evento y sitemaps", () => {
    expect(isAllowed("/gdg-madrid/", rules)).toBe(true);
    expect(isAllowed("/events/details/google-gdg-madrid-presents-devfest-madrid-2026/", rules)).toBe(true);
    expect(isAllowed("/sitemap-chapters.xml?p=2", rules)).toBe(true);
  });

  it("lee el Crawl-delay de 2 segundos", () => {
    expect(rules.crawlDelaySeconds).toBe(2);
  });

  it("ignora las reglas de grupos de otros agentes", () => {
    const r = parseRobots("User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nDisallow: /api/\n");
    expect(r.disallow).toEqual(["/api/"]);
    expect(isAllowed("/gdg-madrid/", r)).toBe(true);
  });
});

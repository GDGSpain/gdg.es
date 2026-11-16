/** RF-CHAPTERS-001/002: solo se pintan con next/image las URL que permite next.config.ts. */
import { describe, expect, it } from "vitest";
import { isAllowedImageUrl } from "./image-url";

describe("isAllowedImageUrl", () => {
  it.each([
    ["https://res.cloudinary.com/startup-grind/image/upload/logo.png", true],
    ["https://res.cloudinary.com/otra-cuenta/image/upload/logo.png", false],
    ["http://res.cloudinary.com/startup-grind/logo.png", false],
    ["https://example.org/avatar.png", false],
    ["no es una url", false],
    [null, false],
  ])("%s → %s", (url, expected) => {
    expect(isAllowedImageUrl(url)).toBe(expected);
  });
});

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@db": fileURLToPath(new URL("./db", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "db/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/modules/**", "src/shared/**", "src/infrastructure/gdg-source/**", "db/schemas/**"],
      exclude: ["**/*.test.ts", "**/__fixtures__/**"],
      reporter: ["text", "lcov", "json-summary"],
    },
  },
});

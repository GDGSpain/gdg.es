import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Regla de dependencias (ADR-0006, AGENTS.md regla 5): los casos de uso no conocen la infraestructura
  // ni la capa web, y shared no depende de nadie.
  {
    files: ["src/modules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/infrastructure/*", "@/app/*", "**/infrastructure/**", "**/app/**"],
              message: "modules/ no importa infrastructure/ ni app/ (ADR-0006).",
            },
            {
              group: ["firebase-admin", "firebase-admin/*", "firebase", "firebase/*"],
              message:
                "Los casos de uso no usan el SDK de Firebase: van detrás de un puerto (ADR-0006, ADR-0008).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*", "@/infrastructure/*", "@/app/*", "@/sync/*"],
              message: "shared/ no importa a nadie (AGENTS.md regla 5).",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "legacy/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;

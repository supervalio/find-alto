import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Supabase returns dynamic data — `any` is unavoidable for DB rows
      "@typescript-eslint/no-explicit-any": "off",
      // Admin pages use plain <a> for simple back-navigation — intentional
      "@next/next/no-html-link-for-pages": "off",
      // Using Unsplash URLs that don't benefit from next/image optimization
      "@next/next/no-img-element": "off",
      // Proxy handlers have required-but-unused params
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;

import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // .nx holds nx's local task cache, which contains copies of built output
  // (docs/, dist/) that must not be linted.
  globalIgnores(["**/dist/", "docs/", ".nx/"]),

  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // TS-first replacement for eslint-plugin-react. "-typescript" is the
      // no-type-info variant; switch to "recommended-type-checked" only if
      // parserOptions.projectService is turned on.
      eslintReact.configs["recommended-typescript"],
      // Kept alongside eslint-react: these are the React team's own
      // compiler-powered rules. eslint-react ships a
      // "disable-conflict-eslint-plugin-react-hooks" preset if you'd rather
      // its equivalents win instead.
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      // tsconfig leaves noUnusedLocals/noUnusedParameters off, so this is the
      // only thing catching dead code. Prefix with _ to keep something on purpose.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // eslint-react re-implements 9 rules that eslint-plugin-react-hooks also
      // ships, so leaving both on double-reports the same issue. We keep the
      // React team's versions, which are backed by the React Compiler's real
      // analysis rather than AST heuristics. To flip the choice instead, extend
      // eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"]
      // and drop this block.
      "@eslint-react/error-boundaries": "off",
      "@eslint-react/exhaustive-deps": "off",
      "@eslint-react/purity": "off",
      "@eslint-react/rules-of-hooks": "off",
      "@eslint-react/set-state-in-effect": "off",
      "@eslint-react/set-state-in-render": "off",
      "@eslint-react/static-components": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/use-memo": "off",
    },
  },

  // shadcn/ui components are vendored as generated and export their cva
  // variants next to the component. Splitting them out would fight every
  // `shadcn add` update; the cost is only a full reload when editing these.
  {
    files: ["packages/site/src/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Config and build scripts run in Node, not the browser.
  {
    files: ["**/*.config.{ts,mjs}", "packages/*/scripts/**/*.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);

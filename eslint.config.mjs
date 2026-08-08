import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist/", "docs/"]),

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

      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "@typescript-eslint/no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",

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

      // Advisory, not blocking: shadcn/ui files export variants alongside components.
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Config/build files run in Node, not the browser.
  {
    files: ["**/*.config.{ts,mjs}", "eslint.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);

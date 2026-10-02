import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        chrome: "readonly",
        console: "readonly",
        document: "readonly",
        Element: "readonly",
        Event: "readonly",
        HTMLButtonElement: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLUListElement: "readonly",
        MouseEvent: "readonly",
        ShadowRoot: "readonly",
        URL: "readonly",
        window: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

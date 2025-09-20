const { defineConfig, globalIgnores } = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/stylistic",
      "prettier"
    ),

    rules: {
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],

      semi: ["error", "always"],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.node,
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
  },
  {
    files: ["vite/**/*.{mjs,cjs,ts}", "**/*.config.*"],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  globalIgnores(["**/dist/", "**/node_modules/", "**/coverage/", "**/public/", "**/assets/"]),
  globalIgnores(["**/dist/", "**/node_modules/", "**/coverage/", "**/public/", "**/assets/"]),
]);

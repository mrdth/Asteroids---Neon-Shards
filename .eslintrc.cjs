/* ESLint configuration for TypeScript + Vite + Vitest */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/stylistic",
    "prettier",
  ],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/no-explicit-any": "warn",
  },
  overrides: [
    {
      files: ["tests/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
      env: { node: true },
      globals: {
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
    {
      files: ["vite/**/*.{mjs,cjs,ts}", "*.config.*"],
      env: { node: true },
    },
  ],
  ignorePatterns: ["dist/", "node_modules/", "coverage/", "public/", "assets/"],
};

module.exports = {
  root: true,
  extends: [
    "universe/native",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "import/order": "off",
    "@typescript-eslint/consistent-type-imports": "error",
  },
}

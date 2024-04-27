/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@precis/eslint-config/remix.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};

// @ts-check

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@mullerstd/eslint-config', 'eslint-config-prettier'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.yarn', 'node_modules', 'coverage', 'dist', 'schema.gql'],
}

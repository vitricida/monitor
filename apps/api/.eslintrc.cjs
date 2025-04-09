/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@monitor/eslint-config'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
  },
};

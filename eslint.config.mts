module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['no-comments'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-comments/no-comments': 'error',
  },
};

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import', 'jsdoc', 'prefer-arrow'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {},
  ignorePatterns: ['node_modules', 'dist/']

}

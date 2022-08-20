const path = require('path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', './server/tsconfig.build.json', './client/tsconfig.node.json'],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    include: [`${path.resolve(__dirname)}/.eslintrc.js`],
    project: [`${path.resolve(__dirname)}/server/tsconfig.build.json`, `${path.resolve(__dirname)}/client/tsconfig.node.json`],
    sourceType: "module",
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
},
  settings: {
    react: {
      version: '18.2',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
        moduleDirectory: ['node_modules'], 
      },
    },
  },
  rules: {
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'max-classes-per-file': 'off',
    'import/prefer-default-export': 'warn',
    'import/no-cycle': 'warn',
    'class-methods-use-this': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "warn",
  },
};

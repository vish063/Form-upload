module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['lib/**/*.js'],
      env: {
        browser: true,
        node: false,
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ===================================
      // SIMPLE-IMPORT-SORT
      // ===================================
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // Node.js builtins
            ['^node:'],
            // React first
            ['^react$', '^react-dom$'],
            // React related packages
            ['^react'],
            // Other packages
            ['^@?\\w'],
            // Internal packages (@/)
            ['^@/'],
            // Parent imports (..)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports (.)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.?(css|scss|sass|less)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // ===================================
      // ESLINT-PLUGIN-IMPORT
      // ===================================

      // Validação de imports
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-webpack-loader-syntax': 'error',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'error',

      // Warnings úteis
      'import/export': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-deprecated': 'warn',
      'import/no-mutable-exports': 'warn',

      // Estilo de imports
      'import/no-duplicates': 'error',
      'import/no-namespace': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      'import/order': 'off', // Desabilitado porque usamos simple-import-sort
      'import/newline-after-import': 'error',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',

      // Específico para React
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/test/**',
            '**/tests/**',
            '**/__tests__/**',
            '**/setupTests.ts',
            '**/vite.config.ts',
          ],
        },
      ],
    },
  },
]);

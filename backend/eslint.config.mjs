// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // ===================================
      // SIMPLE-IMPORT-SORT
      // ===================================
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins
            ['^node:'],
            // NestJS packages
            ['^@nestjs/'],
            // Other packages
            ['^@?\\w'],
            // Internal packages (@/)
            ['^@/'],
            // Side effect imports
            ['^\\u0000'],
            // Parent imports (..)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports (.)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.?(css|scss)$'],
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

      // Específico para NestJS
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/test/**',
            '**/tests/**',
          ],
        },
      ],
    },
  }
);
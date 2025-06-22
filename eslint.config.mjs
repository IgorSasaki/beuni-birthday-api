import tsEslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import importHelpersPlugin from 'eslint-plugin-import-helpers';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import perfectionistPlugin from 'eslint-plugin-perfectionist';

export default tsEslint.config(
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      prettier: prettierPlugin,
      'import-helpers': importHelpersPlugin,
      'unused-imports': unusedImportsPlugin,
      perfectionist: perfectionistPlugin,
    },
    extends: [
      ...tsEslint.configs.recommended,
    ],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'perfectionist/sort-interfaces': 'error',
      'perfectionist/sort-jsx-props': 'off',
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          groups: [],
        },
      ],
      'perfectionist/sort-imports': 'off',
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            '/^node:/',
            'module',
            '/^@/',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
      'no-useless-constructor': 'off',
      'no-use-before-define': 'off',
      camelcase: 'off',
      'space-before-function-paren': 'off',
      'sort-imports': 'off',
    },
  },
  {
    files: ['**/*.config.js', '.eslintrc.js'],
    languageOptions: {
      parser: undefined,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false,
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  }
);

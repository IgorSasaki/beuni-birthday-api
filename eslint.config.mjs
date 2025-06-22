import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import importHelpers from 'eslint-plugin-import-helpers'
import unusedImports from 'eslint-plugin-unused-imports'
import perfectionist from 'eslint-plugin-perfectionist'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next', 'next/typescript'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      prettier,
      'import-helpers': importHelpers,
      'unused-imports': unusedImports,
      perfectionist,
    },
    rules: {
      'no-useless-constructor': 'off',
      'svg-jsx/camel-case-dash': 'error',
      'svg-jsx/camel-case-colon': 'error',
      'svg-jsx/no-style-string': 'error',

      'perfectionist/sort-interfaces': 'error',
      'perfectionist/sort-jsx-props': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: ['multiline', 'unknown', 'shorthand']
        }
      ],

      'prettier/prettier': 'error',

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'react/react-in-jsx-scope': 'off',
      'space-before-function-paren': 'off',
      'react/prop-types': 'off',
      camelcase: 'off',

      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],

      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
          allowSeparatedGroups: false
        }
      ],

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            ['module', '/^@ant/', '/^@fullstory/'],
            '/^@/',
            ['parent', 'sibling', 'index']
          ],
          alphabetize: { order: 'asc', ignoreCase: true }
        }
      ]
    }
  }
]

export default eslintConfig

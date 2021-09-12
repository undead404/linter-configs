module.exports = {
  env: {
    commonjs: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:editorconfig/noconflict',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:promise/recommended',
    'plugin:array-func/all',
    'plugin:@typescript-eslint/all',
    'plugin:unicorn/all',
    'plugin:eslint-comments/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/all',
    'plugin:postcss-modules/recommended',
    'plugin:react-redux/recommended',
    'plugin:compat/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['./*', 'setup-tests.ts', 'scripts/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-console': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
    {
      env: {
        'jest/globals': true,
      },
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'no-magic-numbers': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react-perf/jsx-no-new-array-as-prop': 'off',
        'react-perf/jsx-no-new-object-as-prop': 'off',
        'react/jsx-no-constructed-context-values': 'off',
      },
    },
    {
      env: {
        'jest/globals': true,
      },
      files: ['**/__mocks__/**'],
      rules: {
        'import/prefer-default-export': 'off',
        'no-magic-numbers': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/prefer-default-export': 'off',
        'max-classes-per-file': 'off',
        'no-shadow': 'off',
      },
    },
    {
      files: ['**/reducers/**'],
      rules: {
        '@typescript-eslint/default-param-last': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'promise',
    'unicorn',
    'array-func',
    'eslint-comments',
    'jest',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'react-perf',
    'simple-import-sort',
    'postcss-modules',
    'editorconfig',
    'react-redux',
    'function-name',
    'compat',
  ],
  root: true,
  rules: {
    'no-param-reassign': ['error', { props: false }],
    // 'consistent-return': 'off',
    // 'arrow-body-style': 0,
    // 'comma-dangle': 0,
    // 'import/prefer-await-to-then': 'off',
    // 'no-underscore-dangle': 'off',
    'unicorn/no-null': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-process-exit': 'off',
    'unicorn/no-process-exit': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-void': ['error', { allowAsStatement: true }],
    'no-magic-numbers': [
      'error',
      {
        ignore: [0, 1, -1],
        ignoreDefaultValues: true,
      },
    ],
    'no-console': 'error',
    'jest/prefer-expect-assertions': 'off',
    'jest/no-conditional-expect': 'off',
    'jest/expect-expect': 'off',
    'jest/prefer-strict-equal': 'off',
    'unicorn/prefer-spread': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node.js builtins.
          // eslint-disable-next-line global-require
          [`^(${require('module').builtinModules.join('|')})(/|$)`],
          // Packages.
          ['^@?(\\w|.)[^./]'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'import/order': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
        },
      },
    ],
    'react-perf/jsx-no-new-object-as-prop': 'warn',
    'react-perf/jsx-no-new-array-as-prop': 'warn',
    'react-perf/jsx-no-new-function-as-prop': 'warn',
    'react-perf/jsx-no-jsx-as-prop': 'warn',
    '@typescript-eslint/no-type-alias': 'off',
    'react/react-in-jsx-scope': 'off',
    'function-name/starts-with-verb': 'error',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`,
        project: '.',
      },
    },
    'postcss-modules': {
      include: /\.module\.css$/,
    },
  },
};

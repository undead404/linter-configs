module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:editorconfig/noconflict',
    'plugin:promise/recommended',
    'plugin:array-func/all',
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
      files: ['./*', 'setup-tests.js', 'scripts/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'no-console': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
    {
      env: {
        'jest/globals': true,
      },
      files: ['**/*.test.js', '**/*.test.jsx'],
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
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
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
    'react',
    'react-hooks',
    'jsx-a11y',
    'react-perf',
    'simple-import-sort',
    'postcss-modules',
    'editorconfig',
    'react-redux',
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
    'no-process-exit': 'off',
    'unicorn/no-process-exit': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
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
    'react/react-in-jsx-scope': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-unsafe-regex': 'warn',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
      webpack: {
        config: {
          resolve: {
            extensions: ['.js', '.jsx'],
          },
        },
      },
    },
    'postcss-modules': {
      include: /\.module\.css$/,
    },
  },
};

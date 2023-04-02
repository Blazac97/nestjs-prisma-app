module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    quotes: ['error', 'single', { 'avoidEscape': true }],
    'object-curly-spacing': ['error', 'always'],
    'array-element-newline': [
      'error',
      'consistent',
      { 'minItems': 4, 'multiline': true }
    ],
    'arrow-body-style': 'off',
    'spaced-comment': 'error',
    semi: ['error', 'always'],
    'no-extra-semi': 'error',
    'jsx-quotes': ['error', 'prefer-single'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "semi": true,
        "quoteProps": "as-needed",
        "jsxSingleQuote": true,
        "trailingComma": "es5",
        "bracketSpacing": true,
        "bracketSameLine": false,
        "arrowParens": "avoid",
        "singleAttributePerLine": false,
        "printWidth": 90
      }
    ]
  },
};

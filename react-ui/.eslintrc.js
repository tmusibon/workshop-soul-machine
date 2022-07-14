module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-console': [0, { extensions: ['.js', '.jsx'] }],
    'object-curly-newline': [0, { extensions: ['.js', '.jsx'] }],
    'operator-linebreak': [0, { extensions: ['.js', '.jsx'] }],
  },
};

export default {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['tailwindcss', '@typescript-eslint', 'prettier'],
  extends: [
    'standard',
    'next/core-web-vitals',
    'plugin:tailwindcss/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
};

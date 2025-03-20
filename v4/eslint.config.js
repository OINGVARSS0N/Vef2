const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'next/core-web-vitals', // Use the Next.js recommended rules
      'prettier', // Ensure Prettier is the last extension
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['./tsconfig.json'], // Path to your tsconfig.json
      sourceType: 'module',
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['@typescript-eslint', 'react-hooks', 'jsx-a11y'],
    rules: {
      // Your custom rules (or overrides) can go here
      'react/react-in-jsx-scope': 'off', // Next.js handles this
      '@typescript-eslint/no-unused-vars': 'warn', // Or 'error'
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn', // Or 'error'
      'no-unused-vars': 'off', // Disable the default no-unused-vars rule
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

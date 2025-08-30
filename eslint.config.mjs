import tseslint from '@electron-toolkit/eslint-config-ts';
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    // Ignore common build and dependency folders
    ignores: ['**/node_modules', '**/dist', '**/out']
  },
  // Use React's recommended JSX rules
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    // Apply these rules to all TypeScript and TSX files
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh
    },
    rules: {
      // Use recommended rules for React Hooks
      ...eslintPluginReactHooks.configs.recommended.rules,

      // Treat most TypeScript errors as warnings instead of errors
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // React Refresh rules for a smoother development experience
      ...eslintPluginReactRefresh.configs.vite.rules,

      // This rule helps with hot-reloading but can be annoying. Make it a warning.
      'react-refresh/only-export-components': 'warn',

      // Adjust some other common rules for leniency
      'no-unused-vars': 'warn',
      'no-empty-function': 'warn'
    }
  },
  // Prettier config comes last to override any style rules
  eslintConfigPrettier
);

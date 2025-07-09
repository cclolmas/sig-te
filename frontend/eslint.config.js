import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

// Configuração do ESLint para o projeto
// Inclui suporte para TypeScript, React Hooks e Vite

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended, // Configurações recomendadas para JavaScript
      tseslint.configs.recommendedTypeChecked, // Padrões SOLID com verificação de tipos
      reactHooks.configs['recommended-latest'], // Regras para React Hooks
      reactRefresh.configs.vite, // Regras para Vite
    ],
    languageOptions: {
      ecmaVersion: 2020, // Suporte para ES2020
      globals: globals.browser, // Definição de variáveis globais do navegador
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])

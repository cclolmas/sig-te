# SIG-TE Frontend

## Introdução

O SIG-TE é um sistema desenvolvido para facilitar a gestão do transporte escolar no Distrito Federal, incluindo atividades extracurriculares. Este repositório contém o frontend do sistema, desenvolvido com React e Material-UI.

## Como Iniciar

1. Instale as dependências:
   ```bash
   pnpm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```
   O frontend estará disponível em [http://localhost:5173](http://localhost:5173).

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── mocks/
│   ├── pages/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── tests/
│   └── theme/
├── package.json
├── vite.config.ts
└── ...
```

- **components/**: Componentes reutilizáveis (ex: dashboard, formulários)
- **context/**: Contextos globais (ex: AuthContext)
- **mocks/**: Dados mockados para testes e desenvolvimento
- **pages/**: Páginas principais do sistema
- **routes/**: Configuração centralizada das rotas
- **schemas/**: Schemas de validação Zod
- **services/**: Camada de API e hooks de dados
- **theme/**: Tema centralizado do MUI

## Como Rodar os Testes

- Para rodar todos os testes:
  ```bash
  npm run test
  ```
- Para ver o relatório de cobertura:
  ```bash
  npm run test -- --coverage
  ```
- Os testes utilizam [Vitest](https://vitest.dev/) e [Testing Library](https://testing-library.com/).
- Testes de acessibilidade usam [jest-axe](https://github.com/nickcolley/jest-axe).

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento Vite
- `npm run build` — Gera a build de produção
- `npm run serve` — Serve a build de produção localmente
- `npm run test` — Executa a suíte de testes

## Observações

- O sistema de design é centralizado no tema do MUI (`/src/theme`).
- Schemas de validação estão em `/src/schemas`.
- Dados mockados para testes estão em `/src/mocks`.
- Todas as chamadas de API são feitas via `/src/services/apiService.ts`.
- O roteamento é configurado em `/src/routes/appRoutes.ts`.
- O padrão de código é garantido por ESLint e Prettier.

---
      reactX.configs['recommended-typescript'],
      // Habilite regras de lint para React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // outras opções...
    },
  },
])
```

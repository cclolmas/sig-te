# SIG-TE: Sistema Integrado de Gestão do Transporte Escolar

![sigte1](https://github.com/user-attachments/assets/ab097664-0629-425d-82bc-ef222e1540c4)

## Visão Geral
O SIG-TE é uma plataforma digital para gestão do transporte escolar, composta por backend (Flask/Python) e frontend (React/Vite/TypeScript), com autenticação JWT, RBAC, dashboards, workflows, notificações, painéis públicos e integração mobile-first.

![sigte2](https://github.com/user-attachments/assets/72287d66-0705-45c0-a4f7-ffb48355d405)
![sigte3](https://github.com/user-attachments/assets/3ccc850b-a43c-4531-be1d-b9c6e19d8f11)
![sigte4](https://github.com/user-attachments/assets/5c7c590f-42fe-49a8-bd3f-d26d53685078)
![sigte5](https://github.com/user-attachments/assets/ce4c9d7b-4726-4ad6-bba3-2e3c8c4e51b8)
![sigte6](https://github.com/user-attachments/assets/99c58259-71d7-4687-a35e-10d4eac8dbc3)
![sigte7](https://github.com/user-attachments/assets/13ff3be2-a0fd-4cd3-825c-07f393946656)


## Clonando o Repositório

Para obter o código-fonte do projeto, execute o comando abaixo:

```bash
git clone https://github.com/cclolmas/sig-te.git
```

Depois de clonar, navegue até o diretório do projeto:

```bash
cd sig-te
```

## Principais Funcionalidades
- **Painel de Acompanhamento de Rotas e Lotação:** Visualização das rotas dos ônibus escolares e acompanhamento da lotação de cada veículo, facilitando o planejamento e a gestão do transporte.
- **Leitura de QR Code:** Validação de embarque/desembarque de estudantes via QR Code, garantindo segurança e controle de presença.
- **Geração de Gráficos Estatísticos:** Dashboards interativos com gráficos sobre frequência, rotas, uso do transporte, entre outros dados relevantes.
- **Autenticação JWT:** Login seguro com controle de acesso baseado em papéis (RBAC).
- **Notificações:** Envio de alertas e comunicados para usuários do sistema.
- **Painéis Públicos:** Visualização de informações relevantes para a comunidade escolar.
- **Workflows Automatizados:** Processos digitais para solicitações, aprovações e gestão de rotas.
- **Integração Mobile-First:** Interface responsiva e otimizada para dispositivos móveis.

## Arquitetura
- **Backend:** Flask, JWT, RBAC, integração S3, geração de relatórios, documentação OpenAPI, testes Pytest.
- **Frontend:** React + Vite + TypeScript, Tailwind, Design System gov.br, Service Worker, gráficos (Recharts), QR Code, testes (Vitest, Cypress, Storybook).
- **Deploy:** Build unificado, arquivos estáticos do frontend servidos pelo Flask.

## Configuração do Ambiente

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- npm 9+
- (Opcional) Docker

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edite as variáveis conforme necessário
```

### Frontend
```bash
cd frontend
npm install
```

## Rodando em Modo de Desenvolvimento

### Backend
```bash
cd backend
source .venv/bin/activate
flask run
```

### Frontend
```bash
cd frontend
npm run dev
```

Acesse o frontend em [http://localhost:5173](http://localhost:5173) e o backend em [http://localhost:5000](http://localhost:5000).

### Como rodar frontend e backend juntos (desenvolvimento)

1. Abra dois terminais:
   - **Terminal 1 (backend):**
     ```bash
     cd backend
     source .venv/bin/activate
     flask run
     ```
   - **Terminal 2 (frontend):**
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

2. O frontend estará disponível em http://localhost:3005 e o backend em http://localhost:5000.

3. Todas as requisições para `/api` feitas pelo frontend serão automaticamente encaminhadas para o backend.

4. Certifique-se de que o CORS está configurado no backend para aceitar as portas do frontend (ver `backend/app.py`).

## Rodando os Testes

Execute todos os testes automatizados (backend e frontend):
```bash
./run_tests.sh
```

- Backend: Pytest (testes de integração, segurança, lógica de negócio)
- Frontend: Vitest, Testing Library, Storybook, Cypress

## Build e Deploy Unificado

Para gerar o build de produção e servir o frontend pelo backend:
```bash
./build.sh
```

Para rodar o backend em produção:
```bash
cd backend
gunicorn --bind 0.0.0.0:8000 wsgi:app
```

## Documentação da API
Acesse a documentação Swagger/OpenAPI em:
```
http://localhost:5000/api/docs
```

## Estrutura do Repositório
- `backend/`: API Flask, modelos, serviços, testes, build, documentação
- `frontend/`: React, componentes, páginas, testes, assets
- `.github/`: Workflows CI/CD

## Contribuindo
Veja o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes de contribuição.

---

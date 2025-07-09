# Backend SIG-TE

## Migrações de Banco de Dados

Este projeto utiliza o Flask-Migrate para gerenciar as migrações do banco de dados.

### Como aplicar as migrações

1. **Inicializar o diretório de migrações:**
   ```bash
   flask db init
   ```
2. **Gerar a primeira migração:**
   ```bash
   flask db migrate -m 'Initial database schema'
   ```
3. **Aplicar as migrações ao banco de dados:**
   ```bash
   flask db upgrade
   ```

Certifique-se de que a variável de ambiente `FLASK_APP` esteja configurada para `app.py` e que o banco de dados PostgreSQL esteja acessível conforme definido em `app.config['SQLALCHEMY_DATABASE_URI']`.

## Servidor de Produção

Para rodar o backend em produção com Gunicorn:

```bash
gunicorn --bind 0.0.0.0:8000 wsgi:app
```

- O Gunicorn irá servir a aplicação Flask definida em `wsgi.py`.
- Os arquivos estáticos do frontend devem estar em `backend/static/` (veja o script `build.sh`).

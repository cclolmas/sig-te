#!/bin/bash

# test_localhost_setup.sh
# Script para verificar a conectividade básica dos servidores de desenvolvimento do SIG-TE.
#
# Instruções:
# 1. Em um terminal, inicie o backend:
#    cd backend && source .venv/bin/activate && flask run
# 2. Em outro terminal, inicie o frontend:
#    cd frontend && npm run dev
# 3. Dê permissão de execução ao script: chmod +x test_localhost_setup.sh
# 4. Execute este script a partir da raiz do projeto:
#    ./test_localhost_setup.sh

FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}--- Iniciando verificação do ambiente de desenvolvimento SIG-TE ---${NC}"

# 1. Verificar se o servidor frontend está respondendo
echo -n "1. Verificando servidor Frontend (Vite) em $FRONTEND_URL..."
if curl -s --head $FRONTEND_URL | head -n 1 | grep "200 OK" > /dev/null; then
    echo -e " ${GREEN}OK${NC}"
else
    echo -e " ${RED}FALHOU${NC}"
    echo "   -> Certifique-se de que o servidor frontend está rodando com 'npm run dev'."
    exit 1
fi

# 2. Verificar se o servidor backend está respondendo
echo -n "2. Verificando servidor Backend (Flask) em $BACKEND_URL/api/health..."
if curl -s $BACKEND_URL/api/health | grep '"status":"ok"' > /dev/null; then
    echo -e " ${GREEN}OK${NC}"
else
    echo -e " ${RED}FALHOU${NC}"
    echo "   -> Certifique-se de que o servidor backend está rodando com 'flask run'."
    exit 1
fi

# 3. Verificar a configuração do CORS
echo -n "3. Verificando a configuração de CORS do Backend..."
CORS_HEADER=$(curl -s -I -X GET -H "Origin: $FRONTEND_URL" $BACKEND_URL/api/health | grep "access-control-allow-origin")
if [[ "$CORS_HEADER" == *"$FRONTEND_URL"* ]]; then
    echo -e " ${GREEN}OK${NC}"
else
    echo -e " ${RED}FALHOU${NC}"
    echo "   -> O cabeçalho 'access-control-allow-origin' não foi encontrado ou está incorreto."
    echo "   -> Verifique a configuração CORS em 'backend/app.py'."
fi

echo -e "\n${GREEN}--- Verificação concluída com sucesso! Ambiente parece estar configurado corretamente. ---${NC}"
#!/bin/bash
set -e

# Navega para o frontend
echo "[build.sh] Instalando dependências do frontend..."
cd frontend
npm install

echo "[build.sh] Gerando build de produção do frontend..."
npm run build

# Volta para a raiz e copia os arquivos estáticos
echo "[build.sh] Copiando arquivos estáticos para backend/static..."
cd ..
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

echo "[build.sh] Build concluído. Os arquivos estáticos estão em backend/static."

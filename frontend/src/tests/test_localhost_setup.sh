#!/bin/bash

echo "Verificando se a porta 5173 (frontend) está aberta..."
if nc -z localhost 5173; then
  echo "✅ Frontend rodando na porta 5173."
else
  echo "❌ Frontend NÃO está rodando na porta 5173."
  exit 1
fi

echo "Verificando se a porta 5000 (backend) está aberta..."
if nc -z localhost 5000; then
  echo "✅ Backend rodando na porta 5000."
else
  echo "❌ Backend NÃO está rodando na porta 5000."
  exit 1
fi

echo "Checando endpoint de saúde do backend..."
if curl -sf http://localhost:5000/api/health > /dev/null; then
  echo "✅ Endpoint /api/health está acessível."
else
  echo "❌ Endpoint /api/health NÃO está acessível."
  exit 1
fi
#!/bin/bash

set -e

# Testa backend
cd backend
if [ ! -d "venv" ] && [ -d ".venv" ]; then
  VENV=".venv"
else
  VENV="venv"
fi
if [ ! -d "$VENV" ]; then
  echo "Virtualenv não encontrado. Execute 'python -m venv $VENV' e instale as dependências."
  exit 1
fi
source $VENV/bin/activate
pytest --disable-warnings || { echo "Backend tests failed"; exit 1; }
deactivate
cd ..

# Testa frontend
cd frontend
if ! command -v npm &> /dev/null; then
  echo "npm não encontrado. Instale Node.js e npm."
  exit 1
fi
npm install --no-audit --no-fund
npm run test || { echo "Frontend tests failed"; exit 1; }
cd ..

echo "All tests passed successfully!"

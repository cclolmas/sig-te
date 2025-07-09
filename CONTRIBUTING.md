# Guia de Contribuição para o SIG-TE

Obrigado por contribuir com o SIG-TE! Siga estas diretrizes para garantir um fluxo de trabalho colaborativo, seguro e eficiente.

## Padrões de Codificação
- **Python:** Siga PEP8. Use tipagem sempre que possível. Prefira docstrings no padrão Google/YAML para endpoints.
- **JavaScript/TypeScript:** Siga o padrão Airbnb (ESLint configurado). Use tipagem explícita em TS.
- **Commits:** Mensagens claras e descritivas. Use prefixos como `feat:`, `fix:`, `test:`, `docs:`, `refactor:`.
- **Testes:** Todo novo recurso deve incluir testes automatizados (Pytest, Vitest, Testing Library, Cypress).

## Fluxo de Pull Requests
1. Crie uma branch a partir de `main` com nome descritivo (`feature/nome`, `fix/bug`, etc).
2. Faça commits pequenos e frequentes.
3. Execute todos os testes locais antes de abrir o PR (`./run_tests.sh`).
4. Abra o Pull Request detalhando o que foi feito, motivação e contexto.
5. Aguarde revisão. Responda a comentários e faça ajustes necessários.
6. O merge será feito após aprovação e CI verde.

## Boas Práticas
- Documente endpoints e componentes.
- Prefira funções puras e componentes funcionais.
- Mantenha o código limpo e modular.
- Não exponha segredos ou dados sensíveis.
- Use variáveis de ambiente para configurações.

## Dúvidas ou Sugestões?
Abra uma issue ou entre em contato com os mantenedores.

---

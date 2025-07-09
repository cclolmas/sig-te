describe('QA - Localhost acessível via Chrome', () => {
  it('Deve carregar a HomePage no localhost', () => {
    cy.visit('http://localhost:5173');
    cy.contains('SIG-TE').should('be.visible');
  });

  it('Deve navegar para todas as rotas principais', () => {
    const routes = [
      '/',
      '/orientacoes',
      '/estudantes',
      '/rotas',
      '/reposicoes',
      '/extracurriculares',
      '/login'
    ];
    routes.forEach((route) => {
      cy.visit(`http://localhost:5173${route}`);
      cy.get('body').should('not.contain', '404');
    });
  });
});

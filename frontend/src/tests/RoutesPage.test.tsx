import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoutesPage from '../pages/RoutesPage';

describe('RoutesPage', () => {
  it('exibe o título principal e botão de criar nova rota', () => {
    render(
      <MemoryRouter>
        <RoutesPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/rotas/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nova rota/i })).toBeInTheDocument();
  });

  it('abre o modal ao clicar em nova rota', () => {
    render(
      <MemoryRouter>
        <RoutesPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /nova rota/i }));
    expect(screen.getByText(/criar nova rota/i)).toBeInTheDocument();
  });

  it('fecha o modal ao clicar no botão de fechar', () => {
    render(
      <MemoryRouter>
        <RoutesPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /nova rota/i }));
    const closeButton = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(/criar nova rota/i)).not.toBeInTheDocument();
  });
});

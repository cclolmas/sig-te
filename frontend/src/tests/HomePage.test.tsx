import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
};

describe('HomePage', () => {
  test('exibe o título principal e botões de navegação', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('Título Principal')).toBeInTheDocument();
    expect(getByText('Botão de Navegação')).toBeInTheDocument();
  });

  test('alterna o tema ao clicar no botão de tema', () => {
    const { getByRole } = render(<HomePage />);
    const themeButton = getByRole('button', { name: /alternar tema/i });
    fireEvent.click(themeButton);
    expect(document.body.style.backgroundColor).toBe('expectedColor');
  });

  test('tem navegação acessível', () => {
    const { getByRole } = render(<HomePage />);
    const navButton = getByRole('button', { name: /navegar/i });
    fireEvent.click(navButton);
    expect(window.location.pathname).toBe('/expectedPath');
  });
});
    expect(screen.queryByTestId('Brightness4Icon')).not.toBeInTheDocument();
  });

  it('tem navegação acessível', () => {
    renderWithProviders(<HomePage />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});

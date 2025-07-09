import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ReplacementPage from '../pages/ReplacementPage';

describe('ReplacementPage', () => {
  it('exibe o título principal e os cards de substituição', () => {
    render(<ReplacementPage />);

    // Verifica o título principal
    expect(screen.getByRole('heading', { name: /substituições/i })).toBeInTheDocument();

    // Verifica o conteúdo do primeiro card de substituição
    expect(screen.getByText(/plano piloto norte 01 \(matutino\)/i)).toBeInTheDocument();
    expect(screen.getByText(/veículo: pce-1a2b/i)).toBeInTheDocument();

    // Verifica o conteúdo do segundo card de substituição
    expect(screen.getByText(/plano piloto norte 02 \(vespertino\)/i)).toBeInTheDocument();
    expect(screen.getByText(/veículo: pce-3c4d/i)).toBeInTheDocument();

    // Verifica se os botões de "Editar" estão presentes
    expect(screen.getAllByRole('button', { name: /editar/i })).toHaveLength(2);
  });
});

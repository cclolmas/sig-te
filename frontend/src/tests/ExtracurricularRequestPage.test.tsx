import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExtracurricularRequestPage from '../pages/ExtracurricularRequestPage';

describe('ExtracurricularRequestPage', () => {
  it('exibe título e seções principais do formulário', () => {
    render(<ExtracurricularRequestPage />);
    expect(screen.getByText(/dados da atividade/i)).toBeTruthy();
    expect(screen.getByText(/informa/i)).toBeTruthy();
    expect(screen.getAllByText(/justificativa/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/declara/i)).toBeTruthy();
  });

  it('valida campo obrigatório de nome da escola', async () => {
    render(<ExtracurricularRequestPage />);
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));
    expect(await screen.findByText(/nome da unidade escolar/i)).toBeTruthy();
  });

  it('envia formulário com dados válidos', async () => {
    render(<ExtracurricularRequestPage />);
    await userEvent.type(screen.getByLabelText(/Unidade Escolar Solicitante/i), 'Escola Teste');
    await userEvent.type(screen.getByLabelText(/Nome da Atividade/i), 'Passeio');
    await userEvent.type(screen.getByLabelText(/Data da Atividade/i), '2025-07-07');
    await userEvent.type(screen.getByLabelText(/Horário da Atividade/i), '08:00');
    await userEvent.type(screen.getByLabelText(/Horário de Embarque/i), '07:30');
    await userEvent.type(screen.getByLabelText(/Horário de Retorno/i), '12:00');
    await userEvent.type(screen.getByLabelText(/Endereço de Embarque/i), 'Rua A, 123');
    await userEvent.type(screen.getByLabelText(/CEP de Embarque/i), '12345-678');
    await userEvent.type(screen.getByLabelText(/Endereço de Desembarque/i), 'Rua B, 456');
    await userEvent.type(screen.getByLabelText(/CEP de Desembarque/i), '87654-321');
    await userEvent.type(screen.getByLabelText(/Quantidade de Passageiros/i), '10');
    await userEvent.type(screen.getByLabelText(/Quantidade de Veículos/i), '1');
    await userEvent.type(screen.getByLabelText(/Justificativa/i), 'Atividade pedagógica');
    await userEvent.click(screen.getByLabelText(/declara/i));
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content) =>
          /solicita.{0,10}enviada.{0,10}sucesso/i.test(content)
        )
      ).toBeInTheDocument();
    });
  });
});

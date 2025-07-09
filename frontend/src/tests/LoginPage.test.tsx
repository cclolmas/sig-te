import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/apiService';

jest.mock('../services/apiService');
const mockedApi = api as jest.Mocked<typeof api>;

const mockAuthContext = {
  user: null,
  token: null,
  isAuthenticated: () => false,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
  error: null,
  userProfile: null,
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('exibe campos de e-mail e senha e botão de login', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('valida e-mail institucional', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.input(screen.getByLabelText(/e-mail institucional/i), {
      target: { value: 'user@gmail.com' },
    });
    fireEvent.input(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(
      await screen.findByText((content) =>
        /institucional/.test(content)
      )
    ).toBeInTheDocument();
  });

  it('realiza o login com sucesso com credenciais válidas', async () => {
    mockedApi.post.mockResolvedValue({
      data: {
        access_token: 'fake-token',
        user: { id: '1', name: 'Test User' },
      },
    });

    renderWithProviders(<LoginPage />);

    fireEvent.input(screen.getByLabelText(/e-mail institucional/i), {
      target: { value: 'user@edu.se.df.gov.br' },
    });
    fireEvent.input(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockAuthContext.login).toHaveBeenCalledWith('fake-token', { id: '1', name: 'Test User' });
    });
  });

  it('exibe mensagem de erro em caso de falha no login', async () => {
    mockedApi.post.mockRejectedValue({
      response: {
        data: {
          detail: 'Credenciais inválidas',
        },
      },
    });

    renderWithProviders(<LoginPage />);

    fireEvent.input(screen.getByLabelText(/e-mail institucional/i), {
      target: { value: 'user@edu.se.df.gov.br' },
    });
    fireEvent.input(screen.getByLabelText(/senha/i), {
      target: { value: 'wrong-password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
  });
});

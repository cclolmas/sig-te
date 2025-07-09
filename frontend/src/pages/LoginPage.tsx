import React from 'react'; // Add this import
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from '../schemas/loginSchema';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import HomeIcon from '@mui/icons-material/Home';
import styles from './GlobalPages.module.css';
import ThemeToggle from '../components/ThemeToggle';

// const schema = loginSchema;

type FormData = z.infer<typeof loginSchema>;

/**
 * Página de login do sistema SIG-TE.
 * Permite autenticação do usuário.
 *
 * @component
 * @example
 * return <LoginPage />
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.senha,
      });
      if (response.data && response.data.access_token) {
        login(response.data.access_token, response.data.user); // user profile opcional
        navigate('/dashboard');
      } else {
        setError('Resposta inesperada do servidor.');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Erro ao conectar com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  return (
    <Box
      className={styles.pageContainer}
      role="main"
      aria-label="Página de login"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b',
        color: theme === 'light' ? '#212529' : '#F8F9FA',
        p: 4,
        position: 'relative',
      }}
    >
      {/* Botão Home */}
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <IconButton color="primary" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          maxWidth: 400,
          width: '100%',
          borderRadius: 4,
          boxShadow: 6,
          mx: 'auto',
          mt: 8,
        }}
        aria-label="Formulário de login"
      >
        <Box textAlign="center" mb={3}>
          <Box
            display="inline-block"
            bgcolor="grey.900"
            color="#E5B800"
            fontWeight={700}
            fontSize={28}
            borderRadius={2}
            px={4}
            py={1}
            mb={2}
            letterSpacing={1}
            aria-label="Logo do SIG-TE"
          >
            SIG-TE
          </Box>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={2}
            tabIndex={0}
            aria-live="polite"
          >
            Bem-vindo! Faça login para continuar.
          </Typography>
        </Box>
        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="E-mail institucional"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
            inputProps={{ 'aria-label': 'E-mail institucional' }}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            {...register('senha')}
            error={!!errors.senha}
            helperText={errors.senha?.message}
            autoComplete="current-password"
            inputProps={{ 'aria-label': 'Senha' }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, borderRadius: 2 }}
            disabled={loading}
            aria-label="Entrar"
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </form>
      </Paper>
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: 'center',
          color: theme === 'light' ? 'text.secondary' : 'text.primary',
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b',
          zIndex: 10,
        }}
      >
        <Box
          display="inline-block"
          bgcolor={theme === 'light' ? 'grey.900' : 'grey.800'}
          color={theme === 'light' ? '#E5B800' : '#FFD700'}
          fontWeight={600}
          fontSize={12}
          borderRadius={2}
          px={4}
          py={1}
          mb={2}
          letterSpacing={1}
          aria-label="Rodapé SIG-TE"
        >
          Sistema de Gestão do Transporte Escolar - Governo do Distrito Federal - 2025
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;

// QA: Instrução para Cypress/E2E
// describe('QA - Rota /login acessível e renderiza corretamente', () => {
//   it('Deve carregar a página de login e exibir o botão Entrar', () => {
//     cy.visit('http://localhost:5173/login');
//     cy.contains('Entrar').should('be.visible');
//   });
// });
// });
//   });
// });
// });

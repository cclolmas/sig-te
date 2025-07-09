import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button as MuiButton,
  TextField,
  IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { extracurricularSchema } from '../schemas/extracurricularSchema';
import styles from './GlobalPages.module.css';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

/**
 * Página de solicitação de atividade extracurricular.
 * Permite ao usuário enviar um pedido de atividade.
 *
 * @component
 * @example
 * return <ExtracurricularRequestPage />
 */
const ExtracurricularRequestPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(extracurricularSchema),
    defaultValues: {
      accessibility: 'nao',
      declaration: false,
    },
  });

  // Atualiza veículos automaticamente
  React.useEffect(() => {
    const passengers = Number(watch('passengers'));
    if (passengers > 0) {
      setValue('vehicles', Math.ceil(passengers / 38).toString());
    }
  }, [watch('passengers'), setValue, watch]);

  React.useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  const onSubmit = async (data: Record<string, any>) => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch('/api/extracurricular-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Erro ao enviar solicitação');
        return;
      }
      alert('Solicitação enviada com sucesso!');
    } catch (err: any) {
      alert('Erro ao enviar solicitação');
    }
  };

  return (
    <Box className={styles.pageContainer} sx={{ maxWidth: 700, mx: 'auto', py: 12, position: 'relative', bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b', color: theme === 'light' ? '#212529' : '#F8F9FA' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <IconButton color="primary" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}> 
        <ThemeToggle />
      </Box>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Typography variant="h2" fontWeight={700} mb={2} component="h1">
          Solicitação de Atividade Extracurricular
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Unidade Escolar Solicitante"
              {...register('schoolName')}
              error={!!errors.schoolName}
              helperText={errors.schoolName ? 'O nome da unidade escolar é obrigatório' : ''}
              fullWidth
            />
            <TextField
              label="Nome da Atividade"
              {...register('activityName')}
              error={!!errors.activityName}
              helperText={errors.activityName?.message}
              fullWidth
            />
            <TextField
              label="Data da Atividade"
              type="date"
              {...register('activityDate')}
              error={!!errors.activityDate}
              helperText={errors.activityDate?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Horário da Atividade"
              type="time"
              {...register('activityTime')}
              error={!!errors.activityTime}
              helperText={errors.activityTime?.message}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="h6" fontWeight={600} mb={1} component="h3">
              Justificativa
            </Typography>
            <TextField
              label="Justificativa"
              {...register('justification')}
              error={!!errors.justification}
              helperText={errors.justification?.message}
              fullWidth
              multiline
              minRows={3}
            />
            <Box>
              <label>
                <input type="checkbox" {...register('declaration')} /> Aceito os termos da declaração
              </label>
              {errors.declaration && (
                <Typography color="error" variant="caption">{errors.declaration.message}</Typography>
              )}
            </Box>
            <MuiButton type="submit" variant="contained" color="primary" fullWidth>
              Enviar Solicitação
            </MuiButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ExtracurricularRequestPage;

// QA: Instrução para Cypress/E2E
// describe('QA - Rota /extracurriculares acessível e renderiza corretamente', () => {
//   it('Deve carregar a página de extracurriculares e exibir o botão Solicitar', () => {
//     cy.visit('http://localhost:5173/extracurriculares');
//     cy.contains('Solicitar').should('be.visible');
//   });
// });
// });
// });
// });

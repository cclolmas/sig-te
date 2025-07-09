/**
 * Página de diretrizes administrativas do SIG-TE.
 * Exibe KPIs e fila de aprovação do GCOTE.
 *
 * @component
 * @example
 * return <AdministrativeGuidelinesPage />
 */
import React from 'react';
import { Box, Typography, Paper, Container, Alert, AlertTitle, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const mockKPIs = {
  duplicateBenefits: 2, // Simulando 2 casos de duplicidade para demonstração
};

export default function AdministrativeGuidelinesPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  React.useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b', color: theme === 'light' ? '#212529' : '#F8F9FA', p: { xs: 2, sm: 4, lg: 8 }, position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <IconButton color="primary" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
      <Container maxWidth="xl">
        {/* Alerta Crítico de Compliance */}
        {mockKPIs.duplicateBenefits > 0 && (
          <Alert severity="error" sx={{ mb: 4 }}>
            <AlertTitle>Alerta de Compliance: Duplicidade de Benefício</AlertTitle>
            Existem <strong>{mockKPIs.duplicateBenefits}</strong> alunos cadastrados simultaneamente no Passe Livre Estudantil e no Transporte Escolar. É obrigatório revisar e corrigir essas situações para evitar sanções administrativas e garantir a correta aplicação dos recursos públicos.
            <Button variant="contained" color="error" sx={{ ml: 2, mt: 2 }} onClick={() => alert('Iniciando auditoria detalhada de duplicidade de benefícios...')}>
              Auditoria Rápida de Duplicidade
            </Button>
          </Alert>
        )}
        {/* Descrição do Sistema */}
        <Paper elevation={1} sx={{ mb: 4, p: 2, background: theme === 'light' ? '#f5f5f5' : '#23232b' }}>
          <Typography variant="body1">
            O SIG-TE é um sistema integrado para gestão do Transporte Escolar do DF, com foco em compliance, transparência e eficiência. Todas as ações são monitoradas para garantir a correta concessão dos benefícios e o cumprimento da legislação vigente, incluindo a LGPD e as portarias específicas do setor.
          </Typography>
        </Paper>
        <Box maxWidth="lg" mx="auto" display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Paper elevation={4} sx={{ p: 6, borderRadius: 4, width: '100%', maxWidth: 600, mx: 'auto', boxShadow: 6 }}>
            <Typography variant="h2" fontWeight={700} mb={1} sx={{ letterSpacing: 1 }}>
              Painel de Controle Administrativo
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14, mb: 2 }}>
              Visão geral e gestão do Sistema Integrado de Transporte Escolar (SIG-TE).
            </Typography>
            {/* Adicione aqui os KPIs, cards ou outros conteúdos do painel */}
            <Box mt={4}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>Relatórios</Typography>
                  <Typography variant="body2" color="text.secondary">Geração de relatórios de frequência e uso do transporte.</Typography>
                  <Box mt={1}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: theme === 'light' ? 'grey.100' : 'grey.900', cursor: 'pointer' }} onClick={() => navigate('/relatorios')}>
                      <Typography color="primary" fontWeight={600}>Ir para Relatórios</Typography>
                    </Paper>
                  </Box>
                </Box>
                <Box>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>Gestão de Escolas</Typography>
                  <Typography variant="body2" color="text.secondary">Acesse a gestão de escolas cadastradas no sistema.</Typography>
                  <Box mt={1}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: theme === 'light' ? 'grey.100' : 'grey.900', cursor: 'pointer' }} onClick={() => navigate('/escolas')}>
                      <Typography color="primary" fontWeight={600}>Ir para Gestão de Escolas</Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

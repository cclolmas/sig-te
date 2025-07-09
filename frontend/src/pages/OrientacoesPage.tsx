import React from 'react'; // Ensure React is imported
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

/**
 * Página de orientações do sistema SIG-TE.
 * Exibe informações úteis para os usuários.
 *
 * @component
 * @example
 * return <OrientacoesPage />
 */
const OrientacoesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  React.useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  return (
    <Box
      role="main"
      aria-label="Página de orientações"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b',
        color: theme === 'light' ? '#212529' : '#F8F9FA',
        p: 4,
      }}
    >
      {/* Botão Home */}
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <IconButton color="primary" onClick={() => navigate('/')}> <HomeIcon /> </IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          maxWidth: 600,
          width: '100%',
          borderRadius: 4,
          boxShadow: 6,
          mx: 'auto',
          mt: 8,
        }}
        aria-label="Conteúdo de orientações"
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={2}
          sx={{ letterSpacing: 1 }}
        >
          Orientações
        </Typography>
        <Typography variant="body1" mb={2}>
          Painel de Controle Administrativo<br />
          Visão geral e gestão do Sistema Integrado de Transporte Escolar (SIG-TE).
        </Typography>
        {/* Estrutura em tópicos das principais orientações */}
        <Box component="section" mt={3} mb={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Principais Orientações e Fluxos do SIG-TE
          </Typography>
          <ul style={{ paddingLeft: 20 }}>
            <li>
              <b>1. Solicitação de Transporte Escolar</b>
              <ul>
                <li>Responsável faz a requisição na escola (UE).</li>
                <li>UE prepara documentação digital e envia via SEI.</li>
                <li>UNIAE analisa e verifica vagas:
                  <ul>
                    <li>Vaga disponível: Status AUTORIZADO, UE notificada.</li>
                    <li>Vaga indisponível: Status EXCEDENTE, UE informada e orientada sobre fila de espera.</li>
                  </ul>
                </li>
                <li>Atualização de sistemas: sincronização de bancos de dados, listas de frequência e censo escolar.</li>
              </ul>
            </li>
            <li style={{ marginTop: 12 }}>
              <b>2. Monitoramento e Pagamento</b>
              <ul>
                <li>Monitoramento diário da frequência dos alunos.</li>
                <li>Validação pela UE e digitalização pela empresa.</li>
                <li>Envio de nota fiscal via SEI e alerta para atesto em 24h.</li>
                <li>Relatório UNIAE, análise TCB e pagamento SUAPE.</li>
              </ul>
            </li>
            <li style={{ marginTop: 12 }}>
              <b>3. Solicitação de Atividade Extracurricular</b>
              <ul>
                <li>UE envia requisição via SEI (mínimo 15 dias de antecedência).</li>
                <li>UNIAE solicita parecer à UNIEB.</li>
                <li>UNIEB retorna parecer (Status: OK).</li>
                <li>UNIAE encaminha para GCOTE, que autoriza e retorna código de controle.</li>
                <li>Se houver impedimento, processo é restituído à UE para ajustes.</li>
              </ul>
            </li>
            <li style={{ marginTop: 12 }}>
              <b>4. Recursos do Sistema</b>
              <ul>
                <li>Botão para retornar à página inicial.</li>
                <li>Alternância entre temas claro e escuro.</li>
                <li>Acesso rápido à página de estudantes.</li>
              </ul>
            </li>
          </ul>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/estudantes')}
          aria-label="Ir para Estudantes"
        >
          Ir para Estudantes
        </Button>
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

export default OrientacoesPage;

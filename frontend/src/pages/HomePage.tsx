import React, { useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

// Dados mockados para os cards de lotação, mantendo a simplicidade.
const busData = [
  { placa: 'PCE-1A2B', rota: 'A.16.M', lotacao: 38, capacidade: 40 },
  { placa: 'PCE-3C4D', rota: 'A.5.1.V', lotacao: 25, capacidade: 30 },
  { placa: 'PCE-5E6F', rota: 'C (GISNO)', lotacao: 10, capacidade: 20 },
  { placa: 'GDF-7G8H', rota: 'A.24.M', lotacao: 39, capacidade: 40 },
  { placa: 'GDF-2Y3Z', rota: 'G.10.M', lotacao: 21, capacidade: 30 }, // novo card
  { placa: 'GDF-4X5W', rota: 'H.7.V', lotacao: 17, capacidade: 25 },  // novo card
];

/**
 * Página inicial do sistema SIG-TE.
 * Exibe um mapa para monitoramento e informações básicas da frota.
 *
 * @component
 * @example
 * return <HomePage />
 */
const HomePage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Efeito para ajustar a cor de fundo do corpo da página de acordo com o tema.
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
    // Cleanup function para reverter a cor quando o componente é desmontado.
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b', color: theme === 'light' ? '#212529' : '#F8F9FA' }}>
      <CssBaseline />

      {/* Barra de Navegação Superior */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            SIG-TE
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate('/orientacoes')}>Orientações</Button>
            <Button color="inherit" onClick={() => navigate('/estudantes')}>Estudantes</Button>
            <Button color="inherit" onClick={() => navigate('/rotas')}>Rotas</Button>
            <Button color="inherit" onClick={() => navigate('/reposicoes')}>Reposições</Button>
            {/* Botão "Extracurriculares" re-incluído conforme solicitado */}
            <Button color="inherit" onClick={() => navigate('/extracurriculares')}>Extracurriculares</Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/login')} sx={{ mx: 2 }}>
              Login @edu
            </Button>
            <ThemeToggle />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo Principal - Margem vertical (py) ajustada */}
      <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Grid container spacing={4}>
          {/* Coluna do Mapa - Largura duplicada para md={18} */}
          <Grid item xs={12} md={18}>
            <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Monitor de Frota</Typography>
              <Box sx={{ flexGrow: 1, minHeight: '800px', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                <iframe
                  id="map-iframe"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245729.3971994042!2d-48.08749999801398!3d-15.72176199969972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3d18df9ae275%3A0x738470e46975af15!2sBras%C3%ADlia%2C%20DF!5e0!3m2!1spt-BR!2sbr!4v1672857453189!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Mapa de Monitoramento de Frota"
                ></iframe>
              </Box>
            </Paper>
          </Grid>

          {/* Coluna dos Cards de Lotação - Largura ajustada para md={6} */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Lotação dos Veículos</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {busData.map((bus) => (
                <Paper key={bus.placa} elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">Placa: {bus.placa}</Typography>
                  <Typography variant="body1">Rota: {bus.rota}</Typography>
                  <Typography variant="body1" color="primary" fontWeight="500">
                    {bus.lotacao} / {bus.capacidade} passageiros
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Rodapé - Margem superior (mt) ajustada para reduzir o espaço */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 4, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ mb: 2, maxWidth: 'sm', mx: 'auto' }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Visualizar Rota Específica
          </Typography>
          <select
            aria-label="Selecionar rota para visualizar no mapa"
            onChange={(e) => {
              const iframe = document.getElementById('map-iframe') as HTMLIFrameElement | null;
              if (iframe) {
                iframe.src = e.target.value;
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: theme === 'light' ? '#fff' : '#333',
              color: theme === 'light' ? '#000' : '#fff'
            }}
          >
            <option value="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245729.3971994042!2d-48.08749999801398!3d-15.72176199969972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3d18df9ae275%3A0x738470e46975af15!2sBras%C3%ADlia%2C%20DF!5e0!3m2!1spt-BR!2sbr!4v1672857453189!5m2!1spt-BR!2sbr">
              Selecione uma rota...
            </option>
            {/* Adicione mais opções de rotas aqui conforme necessário */}
            <option value="URL_DA_ROTA_A1M">Rota A.1.M</option>
            <option value="URL_DA_ROTA_A1V">Rota A.1.V</option>
            <option value="URL_DA_ROTA_A2V">Rota A.2.V</option>
          </select>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Sistema de Gestão do Transporte Escolar - Governo do Distrito Federal - 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;

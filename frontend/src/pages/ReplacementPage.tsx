import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

// --- Dados Mockados baseados nos arquivos de despacho ---
// Estes dados simulam as solicitações de reposição de aula.
const MOCK_REQUESTS = [
  {
    id: 1,
    seiProcess: '00080-00185248/2025-18',
    school: 'CEF 07 de Brasília',
    requestDate: '2025-07-03',
    status: 'Aguardando Código',
    authCode: null,
    details: [
      { useDate: '2025-07-05', refDate: '2025-06-25', route: 'A 16 M', students: 34 },
      { useDate: '2025-07-05', refDate: '2025-06-25', route: 'A 16.1 M', students: 38 },
    ],
  },
  {
    id: 2,
    seiProcess: '00080-00174411/2025-17',
    school: 'Escola Classe Jardim Botânico',
    requestDate: '2025-06-25',
    status: 'Autorizado',
    authCode: '2025-TCBSR154',
    details: [
      { useDate: '2025-06-28', refDate: '2025-04-17', route: 'A.24.M', students: 'N/A' },
      { useDate: '2025-06-28', refDate: '2025-04-17', route: 'A.24.1.M', students: 'N/A' },
    ],
  },
  {
    id: 3,
    seiProcess: '00080-00186921/2025-29',
    school: 'CED GISNO',
    requestDate: '2025-07-01',
    status: 'Encaminhado à GCOTE',
    authCode: null,
    details: [
      { useDate: '2025-07-07', refDate: '2025-06-03', route: 'A.17.V', students: 7 },
    ],
  },
  {
    id: 4,
    seiProcess: '00080-00172293/2025-XX',
    school: 'EC 108 SUL',
    requestDate: '2025-05-30',
    status: 'Cancelado',
    authCode: null,
    details: [
      { useDate: '2025-06-09', refDate: 'N/A', route: 'N/A', students: 0 },
    ],
  },
];

// --- Componente para exibir o status com cores ---
const StatusChip = ({ status }: { status: string }) => {
  let color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'default';
  switch (status) {
    case 'Encaminhado à GCOTE':
      color = 'info';
      break;
    case 'Aguardando Código':
      color = 'warning';
      break;
    case 'Autorizado':
      color = 'success';
      break;
    case 'Cancelado':
      color = 'error';
      break;
    default:
      color = 'secondary';
  }
  return <Chip label={status} color={color} size="small" />;
};

// --- Componente Principal da Página de Reposições ---
export default function ReplacementPage() {
  const [requests] = useState(MOCK_REQUESTS);
  const navigate = useNavigate();
  const { theme } = useTheme();

  React.useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: theme === 'light' ? '#F8F9FA' : '#18181b',
        color: theme === 'light' ? '#212529' : '#F8F9FA',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <IconButton color="primary" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
        <Typography variant="h2" fontWeight={700} component="h2">
          Gestão de Transporte para Reposição de Aulas
        </Typography>
        <ThemeToggle />
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Solicitações Recentes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => alert('Funcionalidade "Nova Solicitação" a ser implementada.')}
          >
            Nova Solicitação
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de solicitações de reposição">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Processo SEI</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Unidade Escolar</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data da Solicitação</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {request.seiProcess}
                  </TableCell>
                  <TableCell>{request.school}</TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell align="center">
                    <StatusChip status={request.status} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Detalhes">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => alert(`Detalhes do Processo: ${request.seiProcess}\nCódigo de Autorização: ${request.authCode || 'N/A'}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// QA: Instrução para Cypress/E2E
// describe('QA - Rota /reposicoes acessível e renderiza corretamente', () => {
//   it('Deve carregar a página de gestão de reposições e exibir a tabela de solicitações', () => {
//     cy.visit('http://localhost:5173/reposicoes');
//     cy.contains('Gestão de Transporte para Reposição de Aulas').should('be.visible');
//     cy.contains('button', 'Nova Solicitação').should('be.visible');
//     cy.get('table').should('be.visible');
//     cy.contains('th', 'Processo SEI').should('be.visible');
//   });
//
//   it('O chip de status deve ter a cor correta', () => {
//     cy.visit('http://localhost:5173/reposicoes');
//     cy.contains('td', '00080-00174411/2025-17').parent('tr').within(() => {
//       cy.get('.MuiChip-colorSuccess').should('contain', 'Autorizado');
//     });
//     cy.contains('td', '00080-00185248/2025-18').parent('tr').within(() => {
//       cy.get('.MuiChip-colorWarning').should('contain', 'Aguardando Código');
//     });
//   });
// });

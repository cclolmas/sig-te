import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';

interface ApprovalRequest {
  id: string;
  type: 'Inclusão de Aluno' | 'Transporte Extracurricular' | 'Alteração de Rota';
  schoolName: string;
  details: string;
  status: 'Pendente';
}

const MOCK_REQUESTS: ApprovalRequest[] = [
  { id: 'REQ-001', type: 'Inclusão de Aluno', schoolName: 'CEF 01 do Planalto', details: 'Inclusão de João da Silva na rota A.40.M', status: 'Pendente' },
  { id: 'REQ-002', type: 'Transporte Extracurricular', schoolName: 'EC 312 Norte', details: 'Visita ao Museu Nacional, 35 alunos', status: 'Pendente' },
  { id: 'REQ-003', type: 'Alteração de Rota', schoolName: 'CEF 07 de Brasília', details: 'Adicionar parada na QNP 28', status: 'Pendente' },
  { id: 'REQ-004', type: 'Inclusão de Aluno', schoolName: 'CED GISNO', details: 'Inclusão de Maria Alves na rota PCD.REDE.9M', status: 'Pendente' },
];

/**
 * Fila de aprovação do GCOTE para o dashboard administrativo.
 * Simula a tela onde um fiscal aprovaria ou negaria diversas solicitações.
 *
 * @component
 * @example
 * <GcoteApprovalQueuePage />
 */
export const GcoteApprovalQueuePage: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(MOCK_REQUESTS);

  const handleAction = (id: string, action: 'approve' | 'deny') => {
    console.log(`Ação: ${action} para a solicitação ${id}`);
    // Remove a solicitação da lista para simular a ação
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Fila de Aprovação GCOTE
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID da Solicitação</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Unidade Escolar</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Detalhes</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>{req.id}</TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>{req.schoolName}</TableCell>
                    <TableCell>{req.details}</TableCell>
                    <TableCell>
                      <Chip label={req.status} color="warning" size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAction(req.id, 'approve')}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleAction(req.id, 'deny')}
                        >
                          Negar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>Nenhuma solicitação pendente.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default GcoteApprovalQueuePage;

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export interface OccurrenceRow {
  date: string;
  total: number;
}

interface OccurrencesTableProps {
  occurrences: OccurrenceRow[];
}

/**
 * Tabela de resumo de ocorrências para o dashboard.
 * @param occurrences Lista de ocorrências por data.
 */
const OccurrencesTable: React.FC<OccurrencesTableProps> = ({ occurrences }) => (
  <Paper elevation={3} sx={{ p: 3 }} role="region" aria-label="Resumo de Ocorrências" data-testid="occurrences-table">
    <Typography variant="h6" fontWeight={600} mb={2}>
      Resumo de Ocorrências (últimos 30 dias)
    </Typography>
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Data</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Total de Ocorrências</th>
          </tr>
        </thead>
        <tbody>
          {occurrences.map((row) => (
            <tr key={row.date}>
              <td style={{ padding: 8 }}>{row.date}</td>
              <td style={{ padding: 8 }}>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Paper>
);

export default OccurrencesTable;

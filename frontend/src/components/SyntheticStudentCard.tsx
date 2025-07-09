import React from 'react';
import QRCode from 'qrcode.react';
import { Box, Typography, Paper } from '@mui/material';

// Dados sintéticos de exemplo
const student = {
  id: '123456',
  name: 'Maria Eduarda Silva',
  cpf: '123.456.789-00',
};

const SyntheticStudentCard: React.FC = () => {
  return (
    <Paper sx={{ width: 300, p: 3, textAlign: 'center', borderRadius: 3, boxShadow: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        {student.name}
      </Typography>
      <Box display="flex" justifyContent="center" mb={2}>
        <QRCode value={student.id} size={128} />
      </Box>
      <Typography variant="subtitle1" color="text.secondary">
        Transporte Escolar
      </Typography>
    </Paper>
  );
};

export default SyntheticStudentCard;

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography } from '@mui/material';

interface Props {
  open: boolean;
  student: any;
  onClose: () => void;
  onSubmit: (id: number, status: string, rejection_reason?: string) => void;
}

const StudentApprovalModal: React.FC<Props> = ({ open, student, onClose, onSubmit }) => {
  const [status, setStatus] = useState('ativo');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = () => {
    onSubmit(student.id, status, status === 'inativo' ? rejectionReason : undefined);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Analisar Cadastro</DialogTitle>
      <DialogContent>
        <Typography mb={2}>Nome: {student.name}</Typography>
        <TextField
          select
          label="Status"
          value={status}
          onChange={e => setStatus(e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="ativo">Ativar</MenuItem>
          <MenuItem value="inativo">Recusar</MenuItem>
        </TextField>
        {status === 'inativo' && (
          <TextField
            label="Motivo da Recusa"
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentApprovalModal;

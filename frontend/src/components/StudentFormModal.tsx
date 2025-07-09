import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: any) => void;
  student?: any;
}

const StudentFormModal: React.FC<Props> = ({ open, onClose, onSubmit, student }) => {
  const [form, setForm] = useState({ nome: '', cpf: '', pcd: false });

  useEffect(() => {
    if (student) setForm(student);
    else setForm({ nome: '', cpf: '', pcd: false });
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{student ? 'Editar Estudante' : 'Novo Estudante'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome Completo"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CPF"
          name="cpf"
          value={form.cpf}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={<Checkbox checked={form.pcd} onChange={e => setForm({ ...form, pcd: e.target.checked })} />}
          label="PCD"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSubmit(form)} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentFormModal;

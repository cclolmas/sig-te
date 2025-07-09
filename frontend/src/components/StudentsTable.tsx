import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Tooltip, Button } from '@mui/material';
import { Edit, Delete, AlertCircle } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  cpf?: string;
  status: string;
  pcd?: boolean;
  rejection_reason?: string;
}

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onApprove: (student: Student) => void;
  userRole?: string;
}

const statusColors: Record<string, 'default' | 'success' | 'error' | 'warning'> = {
  pendente: 'warning',
  ativo: 'success',
  recusado: 'error',
  inativo: 'default',
};

const StudentsTable: React.FC<Props> = ({ students, onEdit, onDelete, onApprove, userRole }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>PCD</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.cpf}</TableCell>
              <TableCell>
                <Chip label={student.status} color={statusColors[student.status] || 'default'} size="small" />
              </TableCell>
              <TableCell>{student.pcd ? 'Sim' : 'Não'}</TableCell>
              <TableCell>
                <Tooltip title="Editar">
                  <IconButton onClick={() => onEdit(student)}><Edit size={18} /></IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton onClick={() => onDelete(student.id)}><Delete size={18} /></IconButton>
                </Tooltip>
                {userRole && ['super_admin', 'fiscal_gcote'].includes(userRole) && student.status === 'pendente' && (
                  <Tooltip title="Analisar Cadastro">
                    <Button size="small" color="warning" onClick={() => onApprove(student)} startIcon={<AlertCircle size={16} />}>Analisar</Button>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentsTable;

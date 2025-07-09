import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

/**
 * ActionCard component for quick actions in the dashboard.
 *
 * @param props - Properties for the ActionCard
 * @example
 * <ActionCard title="Aprovar Alunos" icon={<UserPlus />} onClick={() => alert('Action triggered')} />
 */
const ActionCard: React.FC<ActionCardProps> = ({ title, icon, onClick }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ mb: 1 }}>{icon}</Box>
      <Typography variant="h6" align="center">
        {title}
      </Typography>
    </Paper>
  );
};

export default ActionCard;

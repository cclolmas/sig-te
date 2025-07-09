import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        borderRadius: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="start">
        <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        {icon && (
          <Box color="primary.main">
            {icon}
          </Box>
        )}
      </Box>
      <Typography variant="h4" fontWeight={700} mt={2}>
        {value}
      </Typography>
    </Paper>
  );
};

export default KpiCard;

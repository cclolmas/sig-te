import React from 'react';
import BarChart from './BarChart';

export default {
  title: 'Componentes/BarChart',
  component: BarChart,
};

const mockData = [
  { name: 'Rota 1', occupancyRate: 0.45 },
  { name: 'Rota 2', occupancyRate: 0.8 },
  { name: 'Rota 3', occupancyRate: 1.1 },
  { name: 'Rota 4', occupancyRate: 0.3 },
  { name: 'Rota 5', occupancyRate: 0.95 },
];

export const Default = () => <BarChart data={mockData} />;

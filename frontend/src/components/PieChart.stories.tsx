import PieChart from './PieChart';

export default {
  title: 'Componentes/PieChart',
  component: PieChart,
};

const mockData = [
  { name: 'Mecânica', value: 12 },
  { name: 'Indisciplina', value: 8 },
  { name: 'Atraso', value: 5 },
  { name: 'Acidente', value: 2 },
];

export const Default = () => <PieChart data={mockData} />;

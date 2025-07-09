import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  data: Array<{ name: string; occupancyRate: number }>;
}

const CustomBarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="occupancyRate"
          fill="#8884d8"
          label={{ position: 'top' }}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.occupancyRate > 1
                  ? '#ff4d4f' // Red for overcapacity
                  : entry.occupancyRate < 0.5
                  ? '#ffc107' // Yellow for underutilization
                  : '#4caf50' // Green for normal
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;

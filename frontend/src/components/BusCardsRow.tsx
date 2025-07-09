import React from 'react';
import { Bus, Gauge } from 'lucide-react';

interface BusCardProps {
  rota: string;
  lotacao: string;
  placa: string;
}

const icons = [<Bus key="bus" />, <Gauge key="gauge" />];

const BusCard: React.FC<BusCardProps> = ({ rota, lotacao, placa }) => (
  <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md px-6 py-4 min-w-[160px] max-w-[200px] mx-2">
    <div className="mb-2 text-blue-700 dark:text-blue-200">{icons[0]}</div>
    <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{rota}</div>
    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Placa: {placa}</div>
    <div className="flex items-center gap-1 mt-1">
      <span className="text-sm text-gray-700 dark:text-gray-200">Lotação:</span>
      <span className="font-semibold text-blue-600 dark:text-blue-300">{lotacao}</span>
    </div>
  </div>
);

interface BusCardsRowProps {
  data: BusCardProps[];
}

const BusCardsRow: React.FC<BusCardsRowProps> = ({ data }) => (
  <section className="w-full flex justify-center mt-8 mb-12">
    <div className="flex flex-row flex-wrap justify-center gap-4 w-full max-w-5xl">
      {data.map((bus) => (
        <BusCard key={bus.rota + bus.placa} {...bus} />
      ))}
    </div>
  </section>
);

export default BusCardsRow;

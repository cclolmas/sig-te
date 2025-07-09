import React from 'react';

const MapSection: React.FC = () => {
  return (
    <section className="w-full flex justify-center my-10">
      <div className="w-full max-w-5xl min-h-[340px] h-[40vw] bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-xl flex items-center justify-center relative overflow-hidden">
        {/* Substitua pelo mapa real futuramente */}
        <span className="text-gray-400 text-lg md:text-2xl select-none">[Mapa Interativo — Placeholder]</span>
      </div>
    </section>
  );
};

export default MapSection;

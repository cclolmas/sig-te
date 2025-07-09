import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.classList.remove('fade-in');
      // Força reflow para reiniciar animação
      void mainRef.current.offsetWidth;
      mainRef.current.classList.add('fade-in');
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main ref={mainRef} className="flex-1 container mx-auto px-4 py-8 card">
        <Outlet />
      </main>
    </div>
  );
}

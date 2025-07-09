import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="Alternar tema"
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full border border-neon-pink dark:border-neon-cyan bg-white dark:bg-gray-900 hover:bg-neon-pink dark:hover:bg-neon-cyan transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-pink dark:focus:ring-neon-cyan"
      style={{
        boxShadow: theme === 'light'
          ? '0 0 0 3px #0C326F, 0 2px 8px 0 #0C326F'
          : '0 0 0 3pxrgb(97, 117, 150), 0 2px 8px 0 #0C326F',
        color: theme === 'light' ? '#FFD700' : '#0C326F',
        background: theme === 'light' ? 'light' : 'light',
        transition: 'box-shadow 0.2s, color 0.2s, background 0.2s',
      }}
    >
      {theme === 'light' ? <Sun size={28} strokeWidth={2.2} color="#FFD700" /> : <Moon size={28} strokeWidth={2.2} color="#0C326F" />}
    </button>
  );
};

export default ThemeToggle;

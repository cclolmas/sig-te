import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Estratégia de unificação:
 * - Se este contexto apenas alterna entre temas claro/escuro, utilize o ColorModeProvider do MUI.
 * - Remova ThemeContext customizado se não houver lógica extra além do que o MUI já oferece.
 * - Caso haja lógica específica (ex: persistência em localStorage), integre-a ao ColorModeProvider do MUI.
 */

// Exemplo de remoção (se não houver lógica extra):
// Remova este arquivo e utilize apenas o ThemeProvider do MUI no App.

interface ThemeContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Otimize o AuthContext para melhor controle de loading e erro

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface UserProfile {
  id: string;
  role: string;
  school_id?: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUser(JSON.parse(storedProfile));
      } else {
        setUser({ id: '123', role: 'user', school_id: '456' });
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = (token: string, profile: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('jwt', token);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setUser(profile);
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userProfile');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};

export { AuthContext };

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import auth from '@/lib/auth';
import type { User } from '@/types/user';


type AuthContextType = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const userData = await auth.getMe();
      setUser(userData as User);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    refresh();
  }, []);


  const login = async (email: string, pass: string) => {
    await auth.login(email, pass);
    await refresh();
  };

  const register = async (email: string, pass: string, name: string) => {
    await auth.register(email, pass, name);
    await refresh();
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

export default useAuth;
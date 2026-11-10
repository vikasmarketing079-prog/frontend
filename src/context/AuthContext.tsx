import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/index.js';
import { authApi } from '../services/api.js';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, companyName?: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  quickDemoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('siteaudit_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.data.success && res.data.data) {
          const u = res.data.data;
          setUser({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            plan: u.plan,
            companyName: u.companyName,
            whiteLabelSettings: u.whiteLabelSettings,
          });
        }
      } catch {
        localStorage.removeItem('siteaudit_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('siteaudit_token', res.data.data.token);
      setUser(res.data.data.user);
    }
  };

  const register = async (name: string, email: string, password: string, companyName?: string) => {
    const res = await authApi.register({ name, email, password, companyName });
    if (res.data.success) {
      localStorage.setItem('siteaudit_token', res.data.data.token);
      setUser(res.data.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('siteaudit_token');
    setUser(null);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const quickDemoLogin = async () => {
    await login('demo@siteauditpro.com', 'Password123!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

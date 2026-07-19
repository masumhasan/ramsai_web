import React, { createContext, useContext, useState } from 'react';
import { adminLogin as apiLogin, type LoginResponse } from '@/lib/api';

interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
}

interface AdminAuthContextType {
  token: string | null;
  user: AdminUserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gocal_admin_token'));
  const [user, setUser] = useState<AdminUserSession | null>(() => {
    const saved = localStorage.getItem('gocal_admin_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res: LoginResponse = await apiLogin(email, pass);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('gocal_admin_token', res.token);
      localStorage.setItem('gocal_admin_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gocal_admin_token');
    localStorage.removeItem('gocal_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

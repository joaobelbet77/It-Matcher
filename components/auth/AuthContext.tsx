'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CURRENT_USER } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, userType?: 'candidato' | 'empresa' | 'administrador' | boolean) => Promise<boolean>;
  loginCompany: (email: string, pass: string) => Promise<boolean>;
  registerCompany: (data: any) => Promise<boolean>;
  switchAccountType: (type: 'administrador' | 'empresa' | 'recrutador') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      const storedSession = typeof window !== 'undefined' ? localStorage.getItem('itmatcher_session') : null;
      const hasActiveSession = storedSession === 'true';

      if (hasActiveSession) {
        const res = await fetch('/api/perfil');
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          setIsAuthenticated(true);
        } else {
          setUser(CURRENT_USER);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (
    email: string,
    pass: string,
    userType: 'candidato' | 'empresa' | 'administrador' | boolean = 'candidato'
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.setItem('itmatcher_session', 'true');
      document.cookie = "itmatcher_session=true; path=/; max-age=86400;";

      let resolvedType: 'candidato' | 'empresa' | 'administrador' = 'candidato';
      if (typeof userType === 'boolean') {
        resolvedType = userType ? 'empresa' : 'administrador';
      } else if (userType) {
        resolvedType = userType;
      } else if (email.includes('empresa') || email.includes('tech')) {
        resolvedType = 'empresa';
      } else if (email.includes('admin')) {
        resolvedType = 'administrador';
      }

      let loggedUser: User;
      if (resolvedType === 'candidato') {
        let savedCandidateName = 'Carlos Eduardo Silva';
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('itmatcher_candidate_profile');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.name) savedCandidateName = parsed.name;
            }
          } catch (e) {}
        }

        loggedUser = {
          id: 'cand_user_01',
          name: savedCandidateName,
          email: email || 'candidato@itmatcher.com.br',
          role: 'Candidato',
          tipoUsuario: 'candidato',
        };
      } else if (resolvedType === 'empresa') {
        loggedUser = {
          id: 'emp_tech_01',
          name: 'Tech Solutions',
          email: email || 'empresa@techsolutions.com.br',
          role: 'Empresa',
          tipoUsuario: 'empresa',
          company: 'Tech Solutions',
          companyData: {
            id: 'emp_tech_01',
            name: 'Tech Solutions',
            email: email || 'empresa@techsolutions.com.br',
            companyType: 'Empresa de Tecnologia',
            companyIndustry: 'Desenvolvimento de Software',
            companySize: '51–200 funcionários',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            website: 'https://techsolutions.com.br',
            description: 'Empresa líder em desenvolvimento de software e ecossistemas digitais.',
          }
        };
      } else {
        loggedUser = {
          ...CURRENT_USER,
          id: 'admin_master_01',
          name: 'Administrador Master',
          email: email || 'admin@itmatcher.com.br',
          role: 'Administrador',
          tipoUsuario: 'administrador',
        };
      }

      await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loggedUser),
      });

      setUser(loggedUser);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      localStorage.setItem('itmatcher_session', 'true');
      setUser(CURRENT_USER);
      setIsAuthenticated(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const loginCompany = async (email: string, pass: string): Promise<boolean> => {
    return login(email, pass, true);
  };

  const registerCompany = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Erro ao cadastrar empresa');
      }

      localStorage.setItem('itmatcher_session', 'true');
      document.cookie = "itmatcher_session=true; path=/; max-age=86400;";
      setUser(resData.data);
      setIsAuthenticated(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccountType = async (type: 'administrador' | 'empresa' | 'recrutador') => {
    setIsLoading(true);
    try {
      let targetUser: User;
      if (type === 'empresa') {
        targetUser = {
          id: user?.companyData?.id || 'emp_tech_01',
          name: user?.companyData?.name || 'Tech Solutions',
          email: user?.companyData?.email || 'empresa@techsolutions.com.br',
          role: 'Empresa',
          tipoUsuario: 'empresa',
          company: user?.companyData?.name || 'Tech Solutions',
          companyData: user?.companyData || {
            id: 'emp_tech_01',
            name: 'Tech Solutions',
            email: 'empresa@techsolutions.com.br',
            companyType: 'Empresa de Tecnologia',
            companyIndustry: 'Desenvolvimento de Software',
            companySize: '51–200 funcionários',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            website: 'https://techsolutions.com.br',
            description: 'Empresa líder em desenvolvimento de software e ecossistemas digitais.',
          }
        };
      } else {
        targetUser = { ...CURRENT_USER };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('itmatcher_session', 'true');
        document.cookie = "itmatcher_session=true; path=/; max-age=86400;";
      }

      await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetUser),
      });

      setUser(targetUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // 1. Limpar tokens e estados armazenados
    if (typeof window !== 'undefined') {
      localStorage.setItem('itmatcher_session', 'false');
      localStorage.removeItem('itmatcher_candidate_profile');
      localStorage.removeItem('itmatcher_candidate_apps');
      sessionStorage.clear();
      document.cookie = "itmatcher_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "itmatcher_session=false; path=/; max-age=0;";
    }
    
    // 2. Invalidar estado do usuário no frontend
    setUser(null);
    setIsAuthenticated(false);

    // 3. Redirecionar expressamente para a tela de Login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    await checkSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginCompany,
        registerCompany,
        switchAccountType,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  uid: 'usr_mine_01',
  name: 'Anand Sharma',
  email: 'operator@kavach.gov.in',
  role: 'Mine Operator',
  designation: 'Chief Console Operator',
  site: 'Jharia Coalfield Pit #04',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kavach_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    // Auto-authenticate default operator for direct access or allow quick demo login
    return DEFAULT_USER;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400)); // Smooth UX transition

    let userRole: UserRole = role || 'Mine Operator';
    let name = 'Anand Sharma';
    let designation = 'Mine Safety Technician';

    if (email.toLowerCase().includes('admin')) {
      userRole = 'Admin';
      name = 'Dr. Rajesh Verma';
      designation = 'Director of Mine Safety (DGMS)';
    } else if (email.toLowerCase().includes('safety')) {
      userRole = 'Mine Safety Officer';
      name = 'Sunil Kulkarni';
      designation = 'Senior Geotechnical Safety Officer';
    }

    const newUser: User = {
      uid: `usr_${Date.now()}`,
      name,
      email,
      role: userRole,
      designation,
      site: 'Jharia Seam #XI Control Room',
    };

    setUser(newUser);
    localStorage.setItem('kavach_auth_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kavach_auth_user');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 600));
    return true;
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('kavach_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        resetPassword,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

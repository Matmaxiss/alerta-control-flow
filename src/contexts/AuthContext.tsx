
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password?: string) => boolean;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  togglePasswordRequirement: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    requiresPassword: false,
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      role: 'admin',
      shift: '1 shift',
      createdAt: new Date(),
      active: true,
      requiresPassword: true,
    },
  ]);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    const savedUsers = localStorage.getItem('users');
    const savedPasswordReq = localStorage.getItem('requiresPassword');
    
    if (savedAuth) {
      setAuthState(JSON.parse(savedAuth));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedPasswordReq) {
      setAuthState(prev => ({ ...prev, requiresPassword: JSON.parse(savedPasswordReq) }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('requiresPassword', JSON.stringify(authState.requiresPassword));
  }, [authState, users]);

  const login = (username: string, password?: string): boolean => {
    const user = users.find(u => u.username === username && u.active);
    
    if (!user) return false;

    // Admin always requires password
    if (user.role === 'admin') {
      if (password !== '12345678') return false;
    } else if (authState.requiresPassword && user.requiresPassword) {
      // Future: other users might require password
      if (!password) return false;
    }

    setAuthState({
      isAuthenticated: true,
      user,
      requiresPassword: authState.requiresPassword,
    });
    return true;
  };

  const logout = () => {
    setAuthState(prev => ({
      isAuthenticated: false,
      user: null,
      requiresPassword: prev.requiresPassword,
    }));
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const togglePasswordRequirement = () => {
    setAuthState(prev => ({
      ...prev,
      requiresPassword: !prev.requiresPassword,
    }));
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      users,
      addUser,
      updateUser,
      deleteUser,
      togglePasswordRequirement,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

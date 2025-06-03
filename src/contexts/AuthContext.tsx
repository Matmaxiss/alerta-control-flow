
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (username: string, password?: string) => Promise<boolean>;
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

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
    
    // Cargar estado de autenticación desde localStorage
    const savedAuth = localStorage.getItem('auth');
    const savedPasswordReq = localStorage.getItem('requiresPassword');
    
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      if (parsedAuth.user && parsedAuth.user.createdAt) {
        parsedAuth.user.createdAt = new Date(parsedAuth.user.createdAt);
      }
      setAuthState(parsedAuth);
    }
    if (savedPasswordReq) {
      setAuthState(prev => ({ ...prev, requiresPassword: JSON.parse(savedPasswordReq) }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
    localStorage.setItem('requiresPassword', JSON.stringify(authState.requiresPassword));
  }, [authState]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      const usersWithDates = data.map((user: any) => ({
        ...user,
        createdAt: new Date(user.created_at)
      }));
      
      setUsers(usersWithDates);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const login = async (username: string, password?: string): Promise<boolean> => {
    const user = users.find(u => u.username === username && u.active);
    
    if (!user) return false;

    // Admin siempre requiere contraseña
    if (user.role === 'admin') {
      if (password !== '12345678') return false;
    } else if (authState.requiresPassword && user.requiresPassword) {
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

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          created_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error adding user:', error);
        return;
      }
      
      loadUsers(); // Recargar usuarios
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating user:', error);
        return;
      }
      
      loadUsers(); // Recargar usuarios
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting user:', error);
        return;
      }
      
      loadUsers(); // Recargar usuarios
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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


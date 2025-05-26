
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Prensa, PrensaBlock } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  alerts: Alert[];
  prensas: Prensa[];
  prensaBlocks: PrensaBlock[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  cancelAlert: (id: string) => void;
  addPrensa: (prensa: Omit<Prensa, 'id'>) => void;
  updatePrensa: (id: string, updates: Partial<Prensa>) => void;
  deletePrensa: (id: string) => void;
  addPrensaBlock: (block: Omit<PrensaBlock, 'id'>) => void;
  updatePrensaBlock: (id: string, updates: Partial<PrensaBlock>) => void;
  deletePrensaBlock: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [prensas, setPrensas] = useState<Prensa[]>([
    { id: '1', name: 'Press 1', status: 'active', shift: '1 shift' },
    { id: '2', name: 'Press 2', status: 'active', shift: '1 shift' },
    { id: '3', name: 'Press 3', status: 'active', shift: '2 shift' },
    { id: '4', name: 'Press 4', status: 'active', shift: '2 shift' },
  ]);
  const [prensaBlocks, setPrensaBlocks] = useState<PrensaBlock[]>([]);

  useEffect(() => {
    const savedAlerts = localStorage.getItem('alerts');
    const savedPrensas = localStorage.getItem('prensas');
    const savedBlocks = localStorage.getItem('prensaBlocks');
    
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    if (savedPrensas) setPrensas(JSON.parse(savedPrensas));
    if (savedBlocks) setPrensaBlocks(JSON.parse(savedBlocks));
  }, []);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
    localStorage.setItem('prensas', JSON.stringify(prensas));
    localStorage.setItem('prensaBlocks', JSON.stringify(prensaBlocks));
  }, [alerts, prensas, prensaBlocks]);

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const cancelAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'cancelled' as const } : alert
    ));
  };

  const addPrensa = (prensaData: Omit<Prensa, 'id'>) => {
    const newPrensa: Prensa = {
      ...prensaData,
      id: Date.now().toString(),
    };
    setPrensas(prev => [...prev, newPrensa]);
  };

  const updatePrensa = (id: string, updates: Partial<Prensa>) => {
    setPrensas(prev => prev.map(prensa => 
      prensa.id === id ? { ...prensa, ...updates } : prensa
    ));
  };

  const deletePrensa = (id: string) => {
    setPrensas(prev => prev.filter(prensa => prensa.id !== id));
  };

  const addPrensaBlock = (blockData: Omit<PrensaBlock, 'id'>) => {
    const newBlock: PrensaBlock = {
      ...blockData,
      id: Date.now().toString(),
    };
    setPrensaBlocks(prev => [...prev, newBlock]);
  };

  const updatePrensaBlock = (id: string, updates: Partial<PrensaBlock>) => {
    setPrensaBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deletePrensaBlock = (id: string) => {
    setPrensaBlocks(prev => prev.filter(block => block.id !== id));
  };

  return (
    <DataContext.Provider value={{
      alerts,
      prensas,
      prensaBlocks,
      addAlert,
      cancelAlert,
      addPrensa,
      updatePrensa,
      deletePrensa,
      addPrensaBlock,
      updatePrensaBlock,
      deletePrensaBlock,
    }}>
      {children}
    </DataContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Prensa, PrensaBlock } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface AlertButton {
  id: string;
  name: string;
  image?: string;
  color: string;
  allowedRoles: string[];
}

interface DataContextType {
  alerts: Alert[];
  prensas: Prensa[];
  prensaBlocks: PrensaBlock[];
  alertButtons: AlertButton[];
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  cancelAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  setAlertWorking: (id: string) => void;
  addPrensa: (prensa: Omit<Prensa, 'id'>) => void;
  updatePrensa: (id: string, updates: Partial<Prensa>) => void;
  deletePrensa: (id: string) => void;
  addPrensaBlock: (block: Omit<PrensaBlock, 'id'>) => void;
  updatePrensaBlock: (id: string, updates: Partial<PrensaBlock>) => void;
  deletePrensaBlock: (id: string) => void;
  addAlertButton: (button: Omit<AlertButton, 'id'>) => void;
  updateAlertButton: (id: string, updates: Partial<AlertButton>) => void;
  deleteAlertButton: (id: string) => void;
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
  const [prensas, setPrensas] = useState<Prensa[]>([]);
  const [prensaBlocks, setPrensaBlocks] = useState<PrensaBlock[]>([]);
  const [alertButtons, setAlertButtons] = useState<AlertButton[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAlerts();
    loadPrensas();
    loadPrensaBlocks();
    loadAlertButtons();
  }, []);

  // Configurar subscripciones en tiempo real
  useEffect(() => {
    console.log('Configurando subscripciones en tiempo real...');
    
    // Subscripción para alertas
    const alertsSubscription = supabase
      .channel('alerts-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' },
        (payload) => {
          console.log('Alert realtime update:', payload);
          loadAlerts(); // Recargar alertas cuando hay cambios
        }
      )
      .subscribe();

    // Subscripción para prensas
    const prensasSubscription = supabase
      .channel('prensas-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'prensas' },
        (payload) => {
          console.log('Prensa realtime update:', payload);
          loadPrensas();
        }
      )
      .subscribe();

    return () => {
      console.log('Limpiando subscripciones...');
      supabase.removeChannel(alertsSubscription);
      supabase.removeChannel(prensasSubscription);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error loading alerts:', error);
        return;
      }

      const alertsWithDates = data.map((alert: any) => ({
        ...alert,
        timestamp: new Date(alert.timestamp)
      }));
      
      setAlerts(alertsWithDates);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const loadPrensas = async () => {
    try {
      const { data, error } = await supabase
        .from('prensas')
        .select('*');
      
      if (error) {
        console.error('Error loading prensas:', error);
        return;
      }
      
      setPrensas(data || []);
    } catch (error) {
      console.error('Error loading prensas:', error);
    }
  };

  const loadPrensaBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('prensa_blocks')
        .select('*');
      
      if (error) {
        console.error('Error loading prensa blocks:', error);
        return;
      }
      
      setPrensaBlocks(data || []);
    } catch (error) {
      console.error('Error loading prensa blocks:', error);
    }
  };

  const loadAlertButtons = async () => {
    try {
      const { data, error } = await supabase
        .from('alert_buttons')
        .select('*');
      
      if (error) {
        console.error('Error loading alert buttons:', error);
        return;
      }
      
      setAlertButtons(data || []);
    } catch (error) {
      console.error('Error loading alert buttons:', error);
    }
  };

  const addAlert = async (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .insert([alertData]);
      
      if (error) {
        console.error('Error adding alert:', error);
        return;
      }
      
      // Los datos se actualizarán automáticamente por la subscripción en tiempo real
    } catch (error) {
      console.error('Error adding alert:', error);
    }
  };

  const cancelAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) {
        console.error('Error cancelling alert:', error);
        return;
      }
    } catch (error) {
      console.error('Error cancelling alert:', error);
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'resolved' })
        .eq('id', id);
      
      if (error) {
        console.error('Error resolving alert:', error);
        return;
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const setAlertWorking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'working' })
        .eq('id', id);
      
      if (error) {
        console.error('Error setting alert working:', error);
        return;
      }
    } catch (error) {
      console.error('Error setting alert working:', error);
    }
  };

  const addPrensa = async (prensaData: Omit<Prensa, 'id'>) => {
    try {
      const { error } = await supabase
        .from('prensas')
        .insert([prensaData]);
      
      if (error) {
        console.error('Error adding prensa:', error);
        return;
      }
    } catch (error) {
      console.error('Error adding prensa:', error);
    }
  };

  const updatePrensa = async (id: string, updates: Partial<Prensa>) => {
    try {
      const { error } = await supabase
        .from('prensas')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating prensa:', error);
        return;
      }
    } catch (error) {
      console.error('Error updating prensa:', error);
    }
  };

  const deletePrensa = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prensas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting prensa:', error);
        return;
      }
    } catch (error) {
      console.error('Error deleting prensa:', error);
    }
  };

  const addPrensaBlock = async (blockData: Omit<PrensaBlock, 'id'>) => {
    try {
      const { error } = await supabase
        .from('prensa_blocks')
        .insert([blockData]);
      
      if (error) {
        console.error('Error adding prensa block:', error);
        return;
      }
    } catch (error) {
      console.error('Error adding prensa block:', error);
    }
  };

  const updatePrensaBlock = async (id: string, updates: Partial<PrensaBlock>) => {
    try {
      const { error } = await supabase
        .from('prensa_blocks')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating prensa block:', error);
        return;
      }
    } catch (error) {
      console.error('Error updating prensa block:', error);
    }
  };

  const deletePrensaBlock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prensa_blocks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting prensa block:', error);
        return;
      }
    } catch (error) {
      console.error('Error deleting prensa block:', error);
    }
  };

  const addAlertButton = async (buttonData: Omit<AlertButton, 'id'>) => {
    try {
      const { error } = await supabase
        .from('alert_buttons')
        .insert([buttonData]);
      
      if (error) {
        console.error('Error adding alert button:', error);
        return;
      }
    } catch (error) {
      console.error('Error adding alert button:', error);
    }
  };

  const updateAlertButton = async (id: string, updates: Partial<AlertButton>) => {
    try {
      const { error } = await supabase
        .from('alert_buttons')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating alert button:', error);
        return;
      }
    } catch (error) {
      console.error('Error updating alert button:', error);
    }
  };

  const deleteAlertButton = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alert_buttons')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting alert button:', error);
        return;
      }
    } catch (error) {
      console.error('Error deleting alert button:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      alerts,
      prensas,
      prensaBlocks,
      alertButtons,
      addAlert,
      cancelAlert,
      resolveAlert,
      setAlertWorking,
      addPrensa,
      updatePrensa,
      deletePrensa,
      addPrensaBlock,
      updatePrensaBlock,
      deletePrensaBlock,
      addAlertButton,
      updateAlertButton,
      deleteAlertButton,
    }}>
      {children}
    </DataContext.Provider>
  );
};



import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Play, Square, AlertTriangle } from 'lucide-react';
import { ALERT_TYPES } from '../../types';
import { toast } from '@/hooks/use-toast';

const PrensasDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addAlert, alerts } = useData();
  const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({});

  const activeAlerts = alerts.filter(alert => 
    alert.status === 'active' && alert.userId === user?.id
  );

  const handleButtonPress = (alertType: string) => {
    if (alertType === 'Cancel') {
      // Cancel all active alerts for this user
      activeAlerts.forEach(alert => {
        if (alert.userId === user?.id) {
          setPressedButtons(prev => ({ ...prev, [alert.type]: false }));
        }
      });
      
      addAlert({
        type: 'Cancel',
        userId: user?.id || '',
        username: user?.username || '',
        status: 'active',
        shift: user?.shift || '',
      });

      toast({
        title: "Alertas canceladas",
        description: "Todas las alertas activas han sido canceladas",
      });
    } else {
      setPressedButtons(prev => ({ ...prev, [alertType]: true }));
      
      addAlert({
        type: alertType as any,
        userId: user?.id || '',
        username: user?.username || '',
        status: 'active',
        shift: user?.shift || '',
      });

      toast({
        title: "Alerta creada",
        description: `Alerta de tipo ${alertType} ha sido enviada`,
      });
    }
  };

  const getButtonColor = (alertType: string) => {
    if (alertType === 'Cancel') {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    
    const isPressed = pressedButtons[alertType] || activeAlerts.some(alert => 
      alert.type === alertType && alert.userId === user?.id
    );
    
    return isPressed 
      ? 'bg-red-500 hover:bg-red-600' 
      : 'bg-green-500 hover:bg-green-600';
  };

  const getButtonIcon = (alertType: string) => {
    if (alertType === 'Cancel') return Square;
    
    // Fix: Only check for pressed state for non-Cancel buttons
    const isPressed = pressedButtons[alertType] || activeAlerts.some(alert => 
      alert.type === alertType && alert.userId === user?.id
    );
    
    return isPressed ? AlertTriangle : Play;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Panel de Prensas</h1>
      
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">Botones de Alerta</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALERT_TYPES.map((alertType) => {
            const Icon = getButtonIcon(alertType);
            const isPressed = alertType !== 'Cancel' && (
              pressedButtons[alertType] || activeAlerts.some(alert => 
                alert.type === alertType && alert.userId === user?.id
              )
            );
            
            return (
              <button
                key={alertType}
                onClick={() => handleButtonPress(alertType)}
                className={`${getButtonColor(alertType)} text-white p-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="h-8 w-8" />
                  <span className="font-semibold text-lg">{alertType}</span>
                  {isPressed && alertType !== 'Cancel' && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      ACTIVA
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Mis Alertas Activas</h3>
          <div className="space-y-2">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <span className="font-medium text-red-900">{alert.type}</span>
                    <span className="text-sm text-red-600 ml-2">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Activa
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrensasDashboard;

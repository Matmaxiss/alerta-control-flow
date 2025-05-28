import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Play, Square, AlertTriangle, Settings, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PrensasDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addAlert, alerts, cancelAlert, prensas, alertButtons } = useData();
  const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({});

  // Get the press info if user is a press type
  const userPress = user?.role === 'press' ? prensas.find(p => p.id === user.prensaId) : null;

  const activeAlerts = alerts.filter(alert => 
    alert.status === 'active' && alert.userId === user?.id
  );

  // Filter buttons based on user role - admin and supervisor see all buttons
  const visibleButtons = alertButtons.filter(button => {
    if (user?.role === 'admin' || user?.role === 'supervisor') {
      return true; // Admin and supervisor see all buttons
    }
    return button.allowedRoles?.includes(user?.role || '') || false;
  });

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === 'Cancel') {
      // Cancel all active alerts for this user
      activeAlerts.forEach(alert => {
        cancelAlert(alert.id);
      });
      
      // Reset all pressed buttons to green
      setPressedButtons({});
      
      addAlert({
        type: 'Cancel',
        userId: user?.id || '',
        username: user?.username || '',
        status: 'active',
        shift: user?.shift || '',
        prensaId: userPress?.id,
        prensaName: userPress?.name,
      });

      toast({
        title: "Alertas canceladas",
        description: "Todas las alertas activas han sido canceladas",
      });
    } else {
      setPressedButtons(prev => ({ ...prev, [buttonName]: true }));
      
      addAlert({
        type: buttonName,
        userId: user?.id || '',
        username: user?.username || '',
        status: 'active',
        shift: user?.shift || '',
        prensaId: userPress?.id,
        prensaName: userPress?.name,
      });

      toast({
        title: "Alerta creada",
        description: `Alerta de tipo ${buttonName} ha sido enviada desde ${userPress?.name || 'prensa'}`,
      });
    }
  };

  const getButtonColor = (button: any) => {
    if (button.name === 'Cancel') {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    
    const isPressed = pressedButtons[button.name] || activeAlerts.some(alert => 
      alert.type === button.name && alert.userId === user?.id
    );
    
    if (isPressed) {
      return 'bg-red-500 hover:bg-red-600';
    }
    
    // Use custom color or fallback to green
    const customColor = button.color || '#22c55e';
    return `hover:opacity-80`;
  };

  const getButtonIcon = (button: any) => {
    if (button.name === 'Cancel') return Square;
    
    const isPressed = pressedButtons[button.name] || activeAlerts.some(alert => 
      alert.type === button.name && alert.userId === user?.id
    );
    
    return isPressed ? AlertTriangle : Play;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Panel de Prensa</h1>
        {userPress && (
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Settings className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">{userPress.name}</span>
            <span className="text-sm text-blue-600">• {userPress.shift}</span>
          </div>
        )}
      </div>
      
      {userPress && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Información de la Prensa</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Prensa:</span>
              <div className="text-blue-900">{userPress.name}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Turno:</span>
              <div className="text-blue-900">{userPress.shift}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Estado:</span>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                userPress.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {userPress.status === 'active' ? 'Activa' : 'Inactiva'}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Conductor:</span>
              <div className="text-blue-900">{userPress.assignedToDriverName || 'Sin asignar'}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">Botones de Alerta</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visibleButtons.map((button) => {
            const Icon = getButtonIcon(button);
            const isPressed = button.name !== 'Cancel' && (
              pressedButtons[button.name] || activeAlerts.some(alert => 
                alert.type === button.name && alert.userId === user?.id
              )
            );
            
            return (
              <button
                key={button.id}
                onClick={() => handleButtonPress(button.name)}
                className={`${getButtonColor(button)} text-white p-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
                style={{
                  backgroundColor: button.name === 'Cancel' 
                    ? '#eab308' 
                    : isPressed 
                      ? '#ef4444' 
                      : button.color
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  {button.image ? (
                    <img 
                      src={button.image} 
                      alt={button.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <Icon className="h-8 w-8" />
                  )}
                  <span className="font-semibold text-lg">{button.name}</span>
                  {isPressed && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      ACTIVO
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
                    {alert.prensaName && (
                      <span className="text-sm text-red-600 ml-2">
                        • {alert.prensaName}
                      </span>
                    )}
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

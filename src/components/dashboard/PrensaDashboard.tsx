import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Play, Square, AlertTriangle, Settings, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PrensaDashboard: React.FC = () => {
  const { addAlert, alerts, cancelAlert, prensas, alertButtons } = useData();
  const [selectedPrensa, setSelectedPrensa] = useState('');
  const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const selectedPress = prensas.find(p => p.id === selectedPrensa);

  // Debug: log alerts to see what we have
  console.log('All alerts:', alerts);
  console.log('Selected prensa ID:', selectedPrensa);

  const activeAlerts = alerts.filter(alert => {
    console.log('Checking alert:', alert, 'Alert prensaId:', alert.prensaId, 'Selected prensa:', selectedPrensa);
    return alert.status === 'active' && alert.prensaId === selectedPrensa;
  });

  console.log('Active alerts for selected prensa:', activeAlerts);

  // Filter buttons for press role
  const visibleButtons = alertButtons.filter(button => 
    button.allowedRoles?.includes('press') || false
  );

  const handleButtonPress = (buttonName: string) => {
    if (!selectedPress) return;

    if (buttonName === 'Cancel') {
      // Cancel all active alerts for this press
      activeAlerts.forEach(alert => {
        cancelAlert(alert.id);
      });
      
      // Reset all pressed buttons to green
      setPressedButtons({});
      
      addAlert({
        type: 'Cancel',
        userId: selectedPress.id,
        username: selectedPress.name,
        status: 'active',
        shift: selectedPress.shift || '1 shift',
        prensaId: selectedPress.id,
        prensaName: selectedPress.name,
      });

      toast({
        title: "Alertas canceladas",
        description: "Todas las alertas activas han sido canceladas",
      });
    } else {
      setPressedButtons(prev => ({ ...prev, [buttonName]: true }));
      
      console.log('Creating alert for prensa:', selectedPress.id, selectedPress.name);
      
      addAlert({
        type: buttonName,
        userId: selectedPress.id,
        username: selectedPress.name,
        status: 'active',
        shift: selectedPress.shift || '1 shift',
        prensaId: selectedPress.id,
        prensaName: selectedPress.name,
      });

      toast({
        title: "Alerta creada",
        description: `Alerta de tipo ${buttonName} ha sido enviada desde ${selectedPress.name}`,
      });
    }
  };

  const getButtonColor = (button: any) => {
    if (button.name === 'Cancel') {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    
    const isPressed = pressedButtons[button.name] || activeAlerts.some(alert => 
      alert.type === button.name && alert.prensaId === selectedPrensa
    );
    
    if (isPressed) {
      return 'bg-red-500 hover:bg-red-600';
    }
    
    return `hover:opacity-80`;
  };

  const getButtonIcon = (button: any) => {
    if (button.name === 'Cancel') return Square;
    
    const isPressed = pressedButtons[button.name] || activeAlerts.some(alert => 
      alert.type === button.name && alert.prensaId === selectedPrensa
    );
    
    return isPressed ? AlertTriangle : Play;
  };

  if (!selectedPrensa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card p-8 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Panel de Prensa</h1>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Panel Principal</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Prensa
              </label>
              <select
                value={selectedPrensa}
                onChange={(e) => setSelectedPrensa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Seleccionar prensa...</option>
                {prensas.filter(p => p.status === 'active').map(prensa => (
                  <option key={prensa.id} value={prensa.id}>{prensa.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Panel de Prensa</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Panel Principal</span>
          </button>
          <button
            onClick={() => setSelectedPrensa('')}
            className="btn-secondary text-sm"
          >
            Cambiar Prensa
          </button>
        </div>
      </div>
      
      {selectedPress && (
        <div className="card p-4 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Información de la Prensa</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Prensa:</span>
              <div className="text-blue-900">{selectedPress.name}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Turno:</span>
              <div className="text-blue-900">{selectedPress.shift}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Estado:</span>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                selectedPress.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedPress.status === 'active' ? 'Activa' : 'Inactiva'}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Conductor:</span>
              <div className="text-blue-900">{selectedPress.assignedToDriverName || 'Sin asignar'}</div>
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
                alert.type === button.name && alert.prensaId === selectedPrensa
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
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">
          Alertas Activas ({activeAlerts.length})
        </h3>
        {activeAlerts.length > 0 ? (
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
                    <div className="text-sm text-red-600">
                      Prensa: {alert.prensaName}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                  Activa
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay alertas activas para esta prensa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrensaDashboard;

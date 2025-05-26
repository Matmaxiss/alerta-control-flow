
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Play, Square, AlertTriangle, Settings } from 'lucide-react';
import { ALERT_TYPES } from '../../types';
import { toast } from '@/hooks/use-toast';

const PrensasDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addAlert, alerts, prensas } = useData();
  const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({});

  // Get the press info if user is a press type
  const userPress = user?.role === 'press' ? prensas.find(p => p.id === user.prensaId) : null;

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
        prensaId: userPress?.id,
        prensaName: userPress?.name,
      });

      toast({
        title: "Alerts cancelled",
        description: "All active alerts have been cancelled",
      });
    } else {
      setPressedButtons(prev => ({ ...prev, [alertType]: true }));
      
      addAlert({
        type: alertType as any,
        userId: user?.id || '',
        username: user?.username || '',
        status: 'active',
        shift: user?.shift || '',
        prensaId: userPress?.id,
        prensaName: userPress?.name,
      });

      toast({
        title: "Alert created",
        description: `Alert of type ${alertType} has been sent from ${userPress?.name || 'press'}`,
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
    
    const isPressed = pressedButtons[alertType] || activeAlerts.some(alert => 
      alert.type === alertType && alert.userId === user?.id
    );
    
    return isPressed ? AlertTriangle : Play;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Press Panel</h1>
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
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Press Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Press:</span>
              <div className="text-blue-900">{userPress.name}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Shift:</span>
              <div className="text-blue-900">{userPress.shift}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Status:</span>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                userPress.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {userPress.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Driver:</span>
              <div className="text-blue-900">{userPress.assignedToDriverName || 'Unassigned'}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">Alert Buttons</h2>
        
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
                  {isPressed && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      ACTIVE
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
          <h3 className="text-lg font-semibold mb-4">My Active Alerts</h3>
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
                  Active
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

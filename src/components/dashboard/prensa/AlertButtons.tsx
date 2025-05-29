
import React from 'react';
import { Play, Square, AlertTriangle } from 'lucide-react';
import { Alert, Prensa } from '../../../types';

interface AlertButton {
  id: string;
  name: string;
  image?: string;
  color: string;
  allowedRoles: string[];
}

interface AlertButtonsProps {
  buttons: AlertButton[];
  selectedPress: Prensa;
  activeAlerts: Alert[];
  pressedButtons: { [key: string]: boolean };
  onButtonPress: (buttonName: string) => void;
}

const AlertButtons: React.FC<AlertButtonsProps> = ({
  buttons,
  selectedPress,
  activeAlerts,
  pressedButtons,
  onButtonPress
}) => {
  const getButtonColor = (button: AlertButton) => {
    if (button.name === 'Cancel') {
      return 'bg-yellow-500 hover:bg-yellow-600';
    }
    
    const isPressed = pressedButtons[button.name] || activeAlerts.some(alert => 
      alert.type === button.name && alert.prensaId === selectedPress.id
    );
    
    if (isPressed) {
      return 'bg-red-500 hover:bg-red-600';
    }
    
    return `hover:opacity-80`;
  };

  const getButtonIcon = (button: AlertButton) => {
    if (button.name === 'Cancel') return Square;
    
    const isPressed = pressedButtons[button.name] || activeAlerts.some(alert => 
      alert.type === button.name && alert.prensaId === selectedPress.id
    );
    
    return isPressed ? AlertTriangle : Play;
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6">Botones de Alerta</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buttons.map((button) => {
          const Icon = getButtonIcon(button);
          const isPressed = button.name !== 'Cancel' && (
            pressedButtons[button.name] || activeAlerts.some(alert => 
              alert.type === button.name && alert.prensaId === selectedPress.id
            )
          );
          
          return (
            <button
              key={button.id}
              onClick={() => onButtonPress(button.name)}
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
  );
};

export default AlertButtons;

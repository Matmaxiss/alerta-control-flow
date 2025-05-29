
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PrensaSelector from './prensa/PrensaSelector';
import PrensaInfo from './prensa/PrensaInfo';
import AlertButtons from './prensa/AlertButtons';
import ActiveAlerts from './prensa/ActiveAlerts';

const PrensaDashboard: React.FC = () => {
  const { addAlert, alerts, cancelAlert, resolveAlert, prensas, alertButtons } = useData();
  const [selectedPrensa, setSelectedPrensa] = useState('');
  const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  console.log('PrensaDashboard - all alerts:', alerts);
  console.log('PrensaDashboard - selectedPrensa:', selectedPrensa);

  const selectedPress = prensas.find(p => p.id === selectedPrensa);

  const activeAlerts = alerts.filter(alert => {
    const isActive = alert.status === 'active';
    const matchesPrensa = alert.prensaId === selectedPrensa;
    console.log(`Alert ${alert.id}: status=${alert.status}, prensaId=${alert.prensaId}, selectedPrensa=${selectedPrensa}, isActive=${isActive}, matchesPrensa=${matchesPrensa}`);
    return isActive && matchesPrensa;
  });

  console.log('PrensaDashboard - activeAlerts after filter:', activeAlerts);

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

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId);
    
    // Reset the pressed button state for the resolved alert
    const resolvedAlert = alerts.find(alert => alert.id === alertId);
    if (resolvedAlert) {
      setPressedButtons(prev => ({ ...prev, [resolvedAlert.type]: false }));
    }

    toast({
      title: "Alerta resuelta",
      description: "La alerta ha sido marcada como resuelta",
    });
  };

  if (!selectedPrensa) {
    return (
      <PrensaSelector 
        prensas={prensas}
        selectedPrensa={selectedPrensa}
        onSelectPrensa={setSelectedPrensa}
      />
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
      
      {selectedPress && <PrensaInfo prensa={selectedPress} />}
      
      <AlertButtons 
        buttons={visibleButtons}
        selectedPress={selectedPress!}
        activeAlerts={activeAlerts}
        pressedButtons={pressedButtons}
        onButtonPress={handleButtonPress}
      />

      <ActiveAlerts 
        alerts={activeAlerts} 
        onResolveAlert={handleResolveAlert}
      />
    </div>
  );
};

export default PrensaDashboard;

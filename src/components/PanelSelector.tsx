
import React from 'react';
import { Users, Settings, Activity, Truck, Monitor } from 'lucide-react';
import { Button } from './ui/button';

interface PanelSelectorProps {
  onPanelSelect: (panel: string) => void;
}

const PanelSelector: React.FC<PanelSelectorProps> = ({ onPanelSelect }) => {
  const panels = [
    {
      id: 'admin',
      title: 'Panel de Administrador',
      description: 'Gestión completa del sistema',
      icon: Settings,
      color: 'bg-blue-500 hover:bg-blue-600',
      requiresAuth: true
    },
    {
      id: 'supervisor',
      title: 'Panel de Supervisor',
      description: 'Supervisión y alertas',
      icon: Activity,
      color: 'bg-purple-500 hover:bg-purple-600',
      requiresAuth: true
    },
    {
      id: 'press',
      title: 'Panel de Prensa',
      description: 'Control de prensas',
      icon: Monitor,
      color: 'bg-green-500 hover:bg-green-600',
      requiresAuth: true
    },
    {
      id: 'driver',
      title: 'Panel de Conductor',
      description: 'Acceso directo para conductores',
      icon: Truck,
      color: 'bg-orange-500 hover:bg-orange-600',
      requiresAuth: false
    },
    {
      id: 'technical',
      title: 'Panel Técnico',
      description: 'Vista de alertas técnicas',
      icon: Users,
      color: 'bg-gray-500 hover:bg-gray-600',
      requiresAuth: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistema de Alertas</h1>
          <p className="text-lg text-gray-600">Selecciona el panel al que deseas acceder</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {panels.map((panel) => {
            const Icon = panel.icon;
            return (
              <div
                key={panel.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-8 text-center">
                  <div className={`${panel.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{panel.title}</h3>
                  <p className="text-gray-600 mb-6">{panel.description}</p>
                  <Button
                    onClick={() => onPanelSelect(panel.id)}
                    className={`w-full ${panel.color} text-white`}
                  >
                    Acceder
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PanelSelector;

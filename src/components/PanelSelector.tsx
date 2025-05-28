
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Settings, Truck, Eye } from 'lucide-react';

const PanelSelector: React.FC = () => {
  const navigate = useNavigate();

  const panels = [
    {
      id: 'admin',
      title: 'Panel Administrador',
      description: 'Gestión completa del sistema, usuarios y configuraciones',
      icon: Shield,
      color: 'bg-blue-600 hover:bg-blue-700',
      requiresAuth: true,
      path: '/admin'
    },
    {
      id: 'supervisor',
      title: 'Panel Supervisor',
      description: 'Supervisión de operaciones y alertas',
      icon: Eye,
      color: 'bg-green-600 hover:bg-green-700',
      requiresAuth: true,
      path: '/supervisor'
    },
    {
      id: 'driver',
      title: 'Panel Conductor',
      description: 'Acceso directo para conductores',
      icon: Truck,
      color: 'bg-orange-600 hover:bg-orange-700',
      requiresAuth: false,
      path: '/driver'
    },
    {
      id: 'prensa',
      title: 'Panel Prensa',
      description: 'Acceso directo para operadores de prensa',
      icon: Settings,
      color: 'bg-purple-600 hover:bg-purple-700',
      requiresAuth: false,
      path: '/prensa'
    }
  ];

  const handlePanelSelect = (panel: any) => {
    if (panel.requiresAuth) {
      navigate(`/login?panel=${panel.id}`);
    } else {
      navigate(panel.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Gestión Industrial
          </h1>
          <p className="text-xl text-gray-600">
            Seleccione el panel al que desea acceder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panels.map((panel) => {
            const Icon = panel.icon;
            
            return (
              <button
                key={panel.id}
                onClick={() => handlePanelSelect(panel)}
                className={`${panel.color} text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-white/20 p-4 rounded-full">
                    <Icon className="h-12 w-12" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{panel.title}</h3>
                    <p className="text-lg opacity-90">{panel.description}</p>
                  </div>
                  
                  <div className="mt-4">
                    <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                      {panel.requiresAuth ? 'Requiere autenticación' : 'Acceso directo'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PanelSelector;

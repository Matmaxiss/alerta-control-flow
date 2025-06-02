
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, Truck, AlertTriangle, Grid3X3, List, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DriverDashboardNew: React.FC = () => {
  const { users } = useAuth();
  const { prensas, alerts, setAlertWorking, resolveAlert } = useData();
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [isDriverSelected, setIsDriverSelected] = useState(false);
  const [viewMode, setViewMode] = useState<'alerts' | 'presses'>('alerts');
  const navigate = useNavigate();

  const shifts = [...new Set(users.filter(u => u.role === 'driver').map(u => u.shift))];
  const driversInShift = users.filter(u => u.role === 'driver' && u.shift === selectedShift);
  const assignedPrensas = prensas.filter(p => p.assignedToDriver === selectedDriver);
  const selectedDriverUser = users.find(u => u.id === selectedDriver);

  // Only show active and working alerts for driver role
  const activeDriverAlerts = alerts.filter(alert => 
    (alert.status === 'active' || alert.status === 'working') && 
    alert.userId === selectedDriver
  );

  // Get alerts by prensa to determine cube colors
  const getPrensaAlerts = (prensaId: string) => {
    return alerts.filter(alert => 
      (alert.status === 'active' || alert.status === 'working') && 
      alert.prensaId === prensaId
    );
  };

  const handleAlertClick = (alert: any) => {
    console.log('Alert clicked:', alert.id, 'Current status:', alert.status);
    if (alert.status === 'active') {
      setAlertWorking(alert.id);
    } else if (alert.status === 'working') {
      resolveAlert(alert.id);
    }
  };

  const handleDriverConfirm = () => {
    if (selectedShift && selectedDriver) {
      setIsDriverSelected(true);
    }
  };

  const handleBack = () => {
    setIsDriverSelected(false);
    setSelectedShift('');
    setSelectedDriver('');
  };

  if (!isDriverSelected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <Truck className="h-16 w-16 text-orange-500 mx-auto" />
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Inicio</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel de Conductor</h1>
            <p className="text-gray-600">Selecciona tu turno y nombre</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turno
              </label>
              <select
                value={selectedShift}
                onChange={(e) => {
                  setSelectedShift(e.target.value);
                  setSelectedDriver('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Seleccionar turno...</option>
                {shifts.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </div>

            {selectedShift && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conductor
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Seleccionar conductor...</option>
                  {driversInShift.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.username}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedShift && selectedDriver && (
              <button
                onClick={handleDriverConfirm}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header compacto */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Truck className="h-6 w-6 text-orange-500" />
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-gray-500">Turno:</span>
                <span className="font-medium ml-1">{selectedShift}</span>
              </div>
              <div>
                <span className="text-gray-500">Conductor:</span>
                <span className="font-medium ml-1">{selectedDriverUser?.username}</span>
              </div>
              <div>
                <span className="text-gray-500">Prensas:</span>
                <span className="font-medium ml-1">{assignedPrensas.length}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('alerts')}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'alerts' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="h-4 w-4" />
                <span>Alertas</span>
              </button>
              <button
                onClick={() => setViewMode('presses')}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'presses' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                <span>Prensas</span>
              </button>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-md"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Panel Principal</span>
            </button>
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md"
            >
              Cambiar
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'alerts' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Prensas asignadas - compacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-orange-500" />
                Prensas Asignadas
              </h3>
              
              {assignedPrensas.length > 0 ? (
                <div className="space-y-2">
                  {assignedPrensas.map(prensa => (
                    <div key={prensa.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{prensa.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prensa.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prensa.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay prensas asignadas</p>
              )}
            </div>
          </div>

          {/* Alertas activas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Alertas Activas ({activeDriverAlerts.length})</h3>
              
              {activeDriverAlerts.length > 0 ? (
                <div className="space-y-3">
                  {activeDriverAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        alert.status === 'active' 
                          ? 'bg-red-50 border-red-200 hover:border-red-300' 
                          : 'bg-orange-50 border-orange-200 hover:border-orange-300'
                      }`}
                      onClick={() => handleAlertClick(alert)}
                      title={alert.status === 'active' ? 'Haz clic para marcar como "Trabajando"' : 'Haz clic para marcar como "Resuelta"'}
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.status === 'active' ? 'text-red-600' : 'text-orange-600'
                        }`} />
                        <div>
                          <span className={`font-medium ${
                            alert.status === 'active' ? 'text-red-900' : 'text-orange-900'
                          }`}>
                            {alert.type}
                          </span>
                          <div className={`text-sm ${
                            alert.status === 'active' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {alert.timestamp.toLocaleTimeString()}
                            {alert.prensaName && (
                              <span className="ml-2">• {alert.prensaName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'active' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {alert.status === 'active' ? 'ACTIVA' : 'TRABAJANDO'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay alertas activas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Vista de prensas en cubos */
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Prensas Asignadas - Vista de Cubos</h3>
          
          {assignedPrensas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {assignedPrensas.map(prensa => {
                const prensaAlerts = getPrensaAlerts(prensa.id);
                const hasActiveAlerts = prensaAlerts.some(alert => alert.status === 'active');
                const hasWorkingAlerts = prensaAlerts.some(alert => alert.status === 'working');
                
                let bgColor = 'bg-green-50 border-green-200 hover:border-green-300';
                let iconColor = 'bg-green-500';
                let textColor = 'text-green-800';
                let subtextColor = 'text-green-600';
                let statusText = 'Sin alertas';
                
                if (hasActiveAlerts) {
                  bgColor = 'bg-red-50 border-red-200 hover:border-red-300';
                  iconColor = 'bg-red-500';
                  textColor = 'text-red-800';
                  subtextColor = 'text-red-600';
                  statusText = `${prensaAlerts.filter(a => a.status === 'active').length} alerta(s)`;
                } else if (hasWorkingAlerts) {
                  bgColor = 'bg-orange-50 border-orange-200 hover:border-orange-300';
                  iconColor = 'bg-orange-500';
                  textColor = 'text-orange-800';
                  subtextColor = 'text-orange-600';
                  statusText = 'Trabajando';
                }
                
                return (
                  <div
                    key={prensa.id}
                    className={`relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${bgColor}`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${iconColor}`}>
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <h4 className={`text-sm font-semibold ${textColor}`}>
                        {prensa.name}
                      </h4>
                      <p className={`text-xs mt-1 ${subtextColor}`}>
                        {statusText}
                      </p>
                    </div>
                    
                    {/* Badge de estado */}
                    <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      hasActiveAlerts ? 'bg-red-500' : hasWorkingAlerts ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay prensas asignadas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverDashboardNew;

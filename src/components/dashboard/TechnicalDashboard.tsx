
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

const TechnicalDashboard: React.FC = () => {
  const { alerts, resolveAlert } = useData();

  // Filter alerts for technical role
  const technicalAlerts = alerts.filter(alert => 
    alert.status === 'active' && 
    (alert.type === 'Mechanical' || alert.type === 'Electrical' || alert.type === 'Other')
  );

  const handleResolveAlert = (alertId: string) => {
    resolveAlert(alertId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Wrench className="h-8 w-8 text-red-600" />
        <h1 className="text-3xl font-bold text-foreground">Panel Técnico</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Alertas Técnicas Activas ({technicalAlerts.length})</span>
          </h2>
          
          {technicalAlerts.length > 0 ? (
            <div className="space-y-3">
              {technicalAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                  onClick={() => handleResolveAlert(alert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-red-900">{alert.type}</div>
                      <div className="text-sm text-red-600">
                        Prensa: {alert.prensaName} | Usuario: {alert.username}
                      </div>
                      <div className="text-xs text-red-500">
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No hay alertas técnicas activas</p>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas Técnicas</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {alerts.filter(a => a.type === 'Mechanical' && a.status === 'resolved').length}
              </div>
              <div className="text-sm text-blue-600">Alertas Mecánicas Resueltas</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">
                {alerts.filter(a => a.type === 'Electrical' && a.status === 'resolved').length}
              </div>
              <div className="text-sm text-yellow-600">Alertas Eléctricas Resueltas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalDashboard;

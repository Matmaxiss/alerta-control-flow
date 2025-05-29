
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert } from '../../../types';

interface ActiveAlertsProps {
  alerts: Alert[];
}

const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ alerts }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">
        Alertas Activas ({alerts.length})
      </h3>
      {alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.map(alert => (
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
  );
};

export default ActiveAlerts;

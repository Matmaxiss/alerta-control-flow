
import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Alert } from '../../../types';

interface ActiveAlertsProps {
  alerts: Alert[];
  onAlertClick: (alertId: string) => void;
}

const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ alerts, onAlertClick }) => {
  console.log('ActiveAlerts - alerts received:', alerts);
  
  // Filter for active and working alerts, sort by most recent first
  const visibleAlerts = alerts
    .filter(alert => alert.status === 'active' || alert.status === 'working')
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const getAlertStyles = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-red-50 border-red-200 hover:bg-red-100',
          text: 'text-red-900',
          subtext: 'text-red-600',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-800',
          statusText: 'ACTIVA'
        };
      case 'working':
        return {
          bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
          text: 'text-orange-900',
          subtext: 'text-orange-600',
          icon: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800',
          statusText: 'TRABAJANDO'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
          text: 'text-gray-900',
          subtext: 'text-gray-600',
          icon: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800',
          statusText: 'RESUELTA'
        };
    }
  };

  const getClickTitle = (status: string) => {
    switch (status) {
      case 'active':
        return 'Haz clic para marcar como "Trabajando"';
      case 'working':
        return 'Haz clic para marcar como "Resuelta"';
      default:
        return 'Alerta resuelta';
    }
  };

  const getAlertIcon = (status: string) => {
    switch (status) {
      case 'active':
        return AlertTriangle;
      case 'working':
        return Clock;
      default:
        return CheckCircle;
    }
  };
  
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">
        Alertas Activas ({visibleAlerts.length})
      </h3>
      {visibleAlerts.length > 0 ? (
        <div className="space-y-2">
          {visibleAlerts.map(alert => {
            console.log('Rendering alert:', alert);
            const styles = getAlertStyles(alert.status);
            const IconComponent = getAlertIcon(alert.status);
            
            return (
              <div 
                key={alert.id} 
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${styles.bg}`}
                onClick={() => onAlertClick(alert.id)}
                title={getClickTitle(alert.status)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-5 w-5 ${styles.icon}`} />
                  <div>
                    <span className={`font-medium ${styles.text}`}>{alert.type}</span>
                    <span className={`text-sm ${styles.subtext} ml-2`}>
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                    <div className={`text-sm ${styles.subtext}`}>
                      Prensa: {alert.prensaName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                    {styles.statusText}
                  </span>
                </div>
              </div>
            );
          })}
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

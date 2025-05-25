
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, Clock, User, X, Filter } from 'lucide-react';
import { ALERT_TYPES } from '../../types';
import { toast } from '@/hooks/use-toast';

const AlertsView: React.FC = () => {
  const { alerts, cancelAlert } = useData();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    return true;
  });

  const handleCancelAlert = (alertId: string) => {
    cancelAlert(alertId);
    toast({
      title: "Alerta cancelada",
      description: "La alerta ha sido cancelada exitosamente",
    });
  };

  const getAlertColor = (type: string, status: string) => {
    if (status === 'cancelled') return 'bg-gray-50 border-gray-200';
    
    switch (type) {
      case 'Driver': return 'bg-blue-50 border-blue-200';
      case 'Technical': return 'bg-orange-50 border-orange-200';
      case 'Supervisor': return 'bg-purple-50 border-purple-200';
      case 'Cancel': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getAlertTextColor = (type: string, status: string) => {
    if (status === 'cancelled') return 'text-gray-600';
    
    switch (type) {
      case 'Driver': return 'text-blue-800';
      case 'Technical': return 'text-orange-800';
      case 'Supervisor': return 'text-purple-800';
      case 'Cancel': return 'text-green-800';
      default: return 'text-gray-800';
    }
  };

  const canCancelAlert = (alert: any) => {
    return user?.role === 'admin' || user?.role === 'supervisor' || alert.userId === user?.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-foreground">
          Alertas Recientes ({filteredAlerts.length})
        </h2>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              {ALERT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay alertas que mostrar</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card border-l-4 ${getAlertColor(alert.type, alert.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-6 w-6 ${getAlertTextColor(alert.type, alert.status)}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-lg font-semibold ${getAlertTextColor(alert.type, alert.status)}`}>
                        {alert.type}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'active' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.status === 'active' ? 'Activa' : 'Cancelada'}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{alert.username}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{alert.timestamp.toLocaleString()}</span>
                      </div>
                      {alert.prensaName && (
                        <span className="text-gray-500">Prensa: {alert.prensaName}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {alert.status === 'active' && canCancelAlert(alert) && (
                  <button
                    onClick={() => handleCancelAlert(alert.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Cancelar alerta"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsView;


import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Calendar, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, differenceInMinutes, differenceInHours, startOfDay, endOfDay } from 'date-fns';

const ReportsView: React.FC = () => {
  const { alerts, prensas } = useData();
  const [dateRange, setDateRange] = useState({
    start: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  // Filtrar alertas por rango de fechas
  const filteredAlerts = useMemo(() => {
    const startDate = startOfDay(new Date(dateRange.start));
    const endDate = endOfDay(new Date(dateRange.end));
    
    return alerts.filter(alert => 
      alert.timestamp >= startDate && alert.timestamp <= endDate
    );
  }, [alerts, dateRange]);

  // Análisis de tiempo de resolución de alertas
  const alertResolutionAnalysis = useMemo(() => {
    const resolvedAlerts = filteredAlerts.filter(alert => alert.status === 'resolved');
    
    const resolutionTimes = resolvedAlerts.map(alert => {
      // Para este ejemplo, asumimos que las alertas se resuelven en un tiempo aleatorio
      // En una implementación real, necesitarías almacenar el timestamp de resolución
      const resolutionMinutes = Math.floor(Math.random() * 120) + 5; // 5-125 minutos
      return {
        id: alert.id,
        type: alert.type,
        prensaName: alert.prensaName || 'N/A',
        resolutionTime: resolutionMinutes,
        timestamp: alert.timestamp
      };
    });

    const avgResolutionTime = resolutionTimes.length > 0 
      ? resolutionTimes.reduce((sum, item) => sum + item.resolutionTime, 0) / resolutionTimes.length
      : 0;

    // Agrupar por tipo de alerta
    const byType = resolutionTimes.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item.resolutionTime);
      return acc;
    }, {} as Record<string, number[]>);

    const typeAnalysis = Object.entries(byType).map(([type, times]) => ({
      type,
      avgTime: times.reduce((sum, time) => sum + time, 0) / times.length,
      count: times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times)
    }));

    return {
      totalResolved: resolvedAlerts.length,
      avgResolutionTime,
      resolutionTimes,
      typeAnalysis
    };
  }, [filteredAlerts]);

  // Análisis de tiempo de inactividad de prensas
  const prensaDowntimeAnalysis = useMemo(() => {
    // Simulamos datos de downtime para las prensas
    const downtimeData = prensas.map(prensa => {
      const downtimeEvents = Math.floor(Math.random() * 5) + 1; // 1-5 eventos por prensa
      const events = Array.from({ length: downtimeEvents }, (_, i) => {
        const downtimeMinutes = Math.floor(Math.random() * 180) + 10; // 10-190 minutos
        return {
          date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          downtime: downtimeMinutes,
          reason: ['Mantenimiento', 'Falla técnica', 'Cambio de molde', 'Limpieza'][Math.floor(Math.random() * 4)]
        };
      });

      const totalDowntime = events.reduce((sum, event) => sum + event.downtime, 0);
      const avgDowntime = totalDowntime / events.length;

      return {
        prensaId: prensa.id,
        prensaName: prensa.name,
        totalDowntime,
        avgDowntime,
        events,
        eventCount: events.length
      };
    });

    return downtimeData;
  }, [prensas]);

  // Datos para gráficos
  const chartData = useMemo(() => {
    // Datos para gráfico de resolución por día
    const dailyResolutions = filteredAlerts
      .filter(alert => alert.status === 'resolved')
      .reduce((acc, alert) => {
        const day = format(alert.timestamp, 'yyyy-MM-dd');
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const resolutionChartData = Object.entries(dailyResolutions).map(([date, count]) => ({
      date: format(new Date(date), 'dd/MM'),
      resoluciones: count
    }));

    // Datos para gráfico de downtime por prensa
    const downtimeChartData = prensaDowntimeAnalysis.map(prensa => ({
      prensa: prensa.prensaName,
      tiempoInactivo: Math.round(prensa.avgDowntime),
      eventos: prensa.eventCount
    }));

    return {
      resolutionChartData,
      downtimeChartData
    };
  }, [filteredAlerts, prensaDowntimeAnalysis]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reportes y Analytics</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border rounded px-2 py-1"
            />
            <span>a</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Análisis de Alertas</TabsTrigger>
          <TabsTrigger value="downtime">Tiempo de Inactividad</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Métricas generales de alertas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredAlerts.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {alertResolutionAnalysis.totalResolved}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(alertResolutionAnalysis.avgResolutionTime)} min
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activas</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {filteredAlerts.filter(a => a.status === 'active').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de resoluciones por día */}
          <Card>
            <CardHeader>
              <CardTitle>Resoluciones por Día</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.resolutionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="resoluciones" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Análisis por tipo de alerta */}
          <Card>
            <CardHeader>
              <CardTitle>Tiempo de Resolución por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertResolutionAnalysis.typeAnalysis.map((type, index) => (
                  <div key={type.type} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{type.type}</Badge>
                      <span className="text-sm text-gray-600">{type.count} alertas</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{Math.round(type.avgTime)} min promedio</div>
                      <div className="text-xs text-gray-500">
                        Min: {type.minTime}min | Max: {type.maxTime}min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downtime" className="space-y-6">
          {/* Métricas generales de downtime */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prensas Monitoreadas</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prensas.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio Inactividad</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    prensaDowntimeAnalysis.reduce((sum, p) => sum + p.avgDowntime, 0) / 
                    prensaDowntimeAnalysis.length
                  )} min
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prensaDowntimeAnalysis.reduce((sum, p) => sum + p.eventCount, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de downtime por prensa */}
          <Card>
            <CardHeader>
              <CardTitle>Tiempo de Inactividad por Prensa</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.downtimeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="prensa" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tiempoInactivo" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detalle por prensa */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Inactividad por Prensa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prensaDowntimeAnalysis.map((prensa, index) => (
                  <div key={prensa.prensaId} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{prensa.prensaName}</h4>
                        <p className="text-sm text-gray-600">
                          {prensa.eventCount} eventos | {Math.round(prensa.totalDowntime)} min total
                        </p>
                      </div>
                      <Badge variant={prensa.avgDowntime > 60 ? "destructive" : "secondary"}>
                        {Math.round(prensa.avgDowntime)} min promedio
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {prensa.events.slice(0, 3).map((event, eventIndex) => (
                        <div key={eventIndex} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="font-medium">{event.reason}</div>
                          <div className="text-gray-600">{event.downtime} min</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsView;

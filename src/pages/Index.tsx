import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import LoginForm from '../components/LoginForm';
import Layout from '../components/Layout';
import PanelSelector from '../components/PanelSelector';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import SupervisorDashboard from '../components/dashboard/SupervisorDashboard';
import DriverDashboard from '../components/dashboard/DriverDashboard';
import DriverDashboardNew from '../components/dashboard/DriverDashboardNew';
import PrensasDashboard from '../components/dashboard/PrensasDashboard';
import AlertsView from '../components/common/AlertsView';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  // If no panel is selected, show panel selector
  if (!selectedPanel) {
    return <PanelSelector onPanelSelect={setSelectedPanel} />;
  }

  // Driver panel doesn't require authentication
  if (selectedPanel === 'driver') {
    return <DriverDashboardNew />;
  }

  // Other panels require authentication
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (selectedPanel) {
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <div className="text-center text-red-500">Acceso denegado</div>;
      case 'supervisor':
        return user?.role === 'supervisor' || user?.role === 'admin' ? <SupervisorDashboard /> : <div className="text-center text-red-500">Acceso denegado</div>;
      case 'press':
        return user?.role === 'press' || user?.role === 'admin' ? <PrensasDashboard /> : <div className="text-center text-red-500">Acceso denegado</div>;
      case 'technical':
        return user?.role === 'technical' || user?.role === 'admin' ? <AlertsView /> : <div className="text-center text-red-500">Acceso denegado</div>;
      default:
        return <AlertsView />;
    }
  };

  return (
    <Layout>
      <div className="mb-4">
        <button
          onClick={() => setSelectedPanel(null)}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-md"
        >
          ← Volver al selector de paneles
        </button>
      </div>
      {renderDashboard()}
    </Layout>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default Index;

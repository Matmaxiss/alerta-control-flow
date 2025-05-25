
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthProvider } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';
import LoginForm from '../components/LoginForm';
import Layout from '../components/Layout';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import SupervisorDashboard from '../components/dashboard/SupervisorDashboard';
import DriverDashboard from '../components/dashboard/DriverDashboard';
import PrensasDashboard from '../components/dashboard/PrensasDashboard';
import AlertsView from '../components/common/AlertsView';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'driver':
        return <DriverDashboard />;
      case 'prensas':
        return <PrensasDashboard />;
      case 'technical':
        return <AlertsView />;
      default:
        return <AlertsView />;
    }
  };

  return (
    <Layout>
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

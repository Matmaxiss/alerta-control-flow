
import React, { useState } from 'react';
import { Users, Settings, Activity, Plus, BarChart3 } from 'lucide-react';
import UserManagement from '../admin/UserManagement';
import PrensaManagement from '../admin/PrensaManagement';
import ButtonManagement from '../admin/ButtonManagement';
import AlertsView from '../common/AlertsView';
import ReportsView from '../admin/ReportsView';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const { togglePasswordRequirement, requiresPassword } = useAuth();

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: Activity },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'presses', label: 'Presses', icon: Settings },
    { id: 'buttons', label: 'Botones', icon: Plus },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={requiresPassword}
              onChange={togglePasswordRequirement}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-600">Require password for users</span>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'alerts' && <AlertsView />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'presses' && <PrensaManagement />}
        {activeTab === 'buttons' && <ButtonManagement />}
        {activeTab === 'reports' && <ReportsView />}
      </div>
    </div>
  );
};

export default AdminDashboard;


import React, { useState } from 'react';
import { Activity, Settings } from 'lucide-react';
import AlertsView from '../common/AlertsView';
import PrensaManagement from '../admin/PrensaManagement';

const SupervisorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: Activity },
    { id: 'prensas', label: 'Press Management', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Supervisor Panel</h1>

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
        {activeTab === 'prensas' && <PrensaManagement />}
      </div>
    </div>
  );
};

export default SupervisorDashboard;

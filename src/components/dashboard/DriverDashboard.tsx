
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, Truck } from 'lucide-react';
import AlertsView from '../common/AlertsView';

const DriverDashboard: React.FC = () => {
  const { users, user } = useAuth();
  const { prensas } = useData();
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  const shifts = [...new Set(users.filter(u => u.role === 'driver').map(u => u.shift))];
  const driversInShift = users.filter(u => u.role === 'driver' && u.shift === selectedShift);
  const assignedPrensas = prensas.filter(p => p.assignedToDriver === selectedDriver);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Driver Panel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Driver Selection
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift
                </label>
                <select
                  value={selectedShift}
                  onChange={(e) => {
                    setSelectedShift(e.target.value);
                    setSelectedDriver('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select shift...</option>
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>

              {selectedShift && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver
                  </label>
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select driver...</option>
                    {driversInShift.map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.username}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Presses */}
          {selectedDriver && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Assigned Presses
              </h3>
              
              {assignedPrensas.length > 0 ? (
                <div className="space-y-2">
                  {assignedPrensas.map(prensa => (
                    <div key={prensa.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{prensa.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prensa.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prensa.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No assigned presses</p>
              )}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2">
          <AlertsView />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;

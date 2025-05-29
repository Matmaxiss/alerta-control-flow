
import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Prensa } from '../../../types';

interface PrensaSelectorProps {
  prensas: Prensa[];
  selectedPrensa: string;
  onSelectPrensa: (prensaId: string) => void;
}

const PrensaSelector: React.FC<PrensaSelectorProps> = ({
  prensas,
  selectedPrensa,
  onSelectPrensa
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Panel de Prensa</h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Panel Principal</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Prensa
            </label>
            <select
              value={selectedPrensa}
              onChange={(e) => onSelectPrensa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccionar prensa...</option>
              {prensas.filter(p => p.status === 'active').map(prensa => (
                <option key={prensa.id} value={prensa.id}>{prensa.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrensaSelector;

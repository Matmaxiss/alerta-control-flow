
import React from 'react';
import { Prensa } from '../../../types';

interface PrensaInfoProps {
  prensa: Prensa;
}

const PrensaInfo: React.FC<PrensaInfoProps> = ({ prensa }) => {
  return (
    <div className="card p-4 bg-blue-50 border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Información de la Prensa</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-blue-600 font-medium">Prensa:</span>
          <div className="text-blue-900">{prensa.name}</div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Turno:</span>
          <div className="text-blue-900">{prensa.shift}</div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Estado:</span>
          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            prensa.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {prensa.status === 'active' ? 'Activa' : 'Inactiva'}
          </div>
        </div>
        <div>
          <span className="text-blue-600 font-medium">Conductor:</span>
          <div className="text-blue-900">{prensa.assignedToDriverName || 'Sin asignar'}</div>
        </div>
      </div>
    </div>
  );
};

export default PrensaInfo;

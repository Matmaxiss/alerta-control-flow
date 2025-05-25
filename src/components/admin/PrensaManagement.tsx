
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Plus, Edit2, Trash2, Users, Package } from 'lucide-react';
import { SHIFTS } from '../../types';
import { toast } from '@/hooks/use-toast';

const PrensaManagement: React.FC = () => {
  const { prensas, prensaBlocks, addPrensa, updatePrensa, deletePrensa, addPrensaBlock, updatePrensaBlock, deletePrensaBlock } = useData();
  const { users } = useAuth();
  const [activeTab, setActiveTab] = useState('individual');
  const [showPrensaForm, setShowPrensaForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [editingPrensa, setEditingPrensa] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const [prensaForm, setPrensaForm] = useState({
    name: '',
    assignedToDriver: '',
    status: 'active' as const,
    shift: '1 shift' as const,
  });

  const [blockForm, setBlockForm] = useState({
    name: '',
    prensaIds: [] as string[],
    assignedToDriver: '',
  });

  const drivers = users.filter(u => u.role === 'driver' && u.active);

  const handlePrensaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prensaForm.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la prensa es requerido",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...prensaForm,
      assignedToDriverName: prensaForm.assignedToDriver ? 
        drivers.find(d => d.id === prensaForm.assignedToDriver)?.username : undefined
    };

    if (editingPrensa) {
      updatePrensa(editingPrensa, formData);
      toast({
        title: "Éxito",
        description: "Prensa actualizada correctamente",
      });
    } else {
      addPrensa(formData);
      toast({
        title: "Éxito",
        description: "Prensa creada correctamente",
      });
    }

    setPrensaForm({ name: '', assignedToDriver: '', status: 'active', shift: '1 shift' });
    setShowPrensaForm(false);
    setEditingPrensa(null);
  };

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blockForm.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del bloque es requerido",
        variant: "destructive",
      });
      return;
    }

    if (blockForm.prensaIds.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos una prensa",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...blockForm,
      assignedToDriverName: blockForm.assignedToDriver ? 
        drivers.find(d => d.id === blockForm.assignedToDriver)?.username : undefined
    };

    if (editingBlock) {
      updatePrensaBlock(editingBlock, formData);
      toast({
        title: "Éxito",
        description: "Bloque actualizado correctamente",
      });
    } else {
      addPrensaBlock(formData);
      toast({
        title: "Éxito",
        description: "Bloque creado correctamente",
      });
    }

    setBlockForm({ name: '', prensaIds: [], assignedToDriver: '' });
    setShowBlockForm(false);
    setEditingBlock(null);
  };

  const handleEditPrensa = (prensa: any) => {
    setPrensaForm({
      name: prensa.name,
      assignedToDriver: prensa.assignedToDriver || '',
      status: prensa.status,
      shift: prensa.shift,
    });
    setEditingPrensa(prensa.id);
    setShowPrensaForm(true);
  };

  const handleEditBlock = (block: any) => {
    setBlockForm({
      name: block.name,
      prensaIds: block.prensaIds,
      assignedToDriver: block.assignedToDriver || '',
    });
    setEditingBlock(block.id);
    setShowBlockForm(true);
  };

  const handleDeletePrensa = (prensaId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta prensa?')) {
      deletePrensa(prensaId);
      toast({
        title: "Éxito",
        description: "Prensa eliminada correctamente",
      });
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('¿Está seguro de que desea eliminar este bloque?')) {
      deletePrensaBlock(blockId);
      toast({
        title: "Éxito",
        description: "Bloque eliminado correctamente",
      });
    }
  };

  const togglePrensaInBlock = (prensaId: string) => {
    setBlockForm(prev => ({
      ...prev,
      prensaIds: prev.prensaIds.includes(prensaId)
        ? prev.prensaIds.filter(id => id !== prensaId)
        : [...prev.prensaIds, prensaId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Prensas</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('individual')}
            className={`${
              activeTab === 'individual'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <Settings className="h-4 w-4" />
            <span>Prensas Individuales</span>
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`${
              activeTab === 'blocks'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <Package className="h-4 w-4" />
            <span>Bloques de Prensas</span>
          </button>
        </nav>
      </div>

      {/* Individual Prensas Tab */}
      {activeTab === 'individual' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowPrensaForm(true);
                setEditingPrensa(null);
                setPrensaForm({ name: '', assignedToDriver: '', status: 'active', shift: '1 shift' });
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Prensa</span>
            </button>
          </div>

          {/* Prensa Form */}
          {showPrensaForm && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingPrensa ? 'Editar Prensa' : 'Nueva Prensa'}
              </h3>
              
              <form onSubmit={handlePrensaSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Prensa
                  </label>
                  <input
                    type="text"
                    value={prensaForm.name}
                    onChange={(e) => setPrensaForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turno
                  </label>
                  <select
                    value={prensaForm.shift}
                    onChange={(e) => setPrensaForm(prev => ({ ...prev, shift: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {SHIFTS.map(shift => (
                      <option key={shift} value={shift}>{shift}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conductor Asignado
                  </label>
                  <select
                    value={prensaForm.assignedToDriver}
                    onChange={(e) => setPrensaForm(prev => ({ ...prev, assignedToDriver: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Sin asignar</option>
                    {drivers.filter(d => d.shift === prensaForm.shift).map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.username}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={prensaForm.status}
                    onChange={(e) => setPrensaForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>

                <div className="md:col-span-2 flex space-x-4">
                  <button type="submit" className="btn-primary">
                    {editingPrensa ? 'Actualizar' : 'Crear'} Prensa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrensaForm(false);
                      setEditingPrensa(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Prensas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prensas.map((prensa) => (
              <div key={prensa.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{prensa.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPrensa(prensa)}
                      className="text-primary hover:text-primary/80 p-1"
                      title="Editar prensa"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePrensa(prensa.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Eliminar prensa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prensa.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prensa.status === 'active' ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Turno:</span>
                    <span>{prensa.shift}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conductor:</span>
                    <span>{prensa.assignedToDriverName || 'Sin asignar'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blocks Tab */}
      {activeTab === 'blocks' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowBlockForm(true);
                setEditingBlock(null);
                setBlockForm({ name: '', prensaIds: [], assignedToDriver: '' });
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo Bloque</span>
            </button>
          </div>

          {/* Block Form */}
          {showBlockForm && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingBlock ? 'Editar Bloque' : 'Nuevo Bloque'}
              </h3>
              
              <form onSubmit={handleBlockSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Bloque
                    </label>
                    <input
                      type="text"
                      value={blockForm.name}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conductor Asignado
                    </label>
                    <select
                      value={blockForm.assignedToDriver}
                      onChange={(e) => setBlockForm(prev => ({ ...prev, assignedToDriver: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Sin asignar</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>{driver.username}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prensas en el Bloque
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {prensas.map(prensa => (
                      <label key={prensa.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={blockForm.prensaIds.includes(prensa.id)}
                          onChange={() => togglePrensaInBlock(prensa.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{prensa.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    {editingBlock ? 'Actualizar' : 'Crear'} Bloque
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBlockForm(false);
                      setEditingBlock(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prensaBlocks.map((block) => (
              <div key={block.id} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{block.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditBlock(block)}
                      className="text-primary hover:text-primary/80 p-1"
                      title="Editar bloque"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Eliminar bloque"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conductor:</span>
                    <span>{block.assignedToDriverName || 'Sin asignar'}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">
                      Prensas ({block.prensaIds.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {block.prensaIds.map(prensaId => {
                        const prensa = prensas.find(p => p.id === prensaId);
                        return prensa ? (
                          <span
                            key={prensaId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {prensa.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrensaManagement;

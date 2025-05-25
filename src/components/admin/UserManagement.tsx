
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Plus, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import { ROLES, SHIFTS } from '../../types';
import { toast } from '@/hooks/use-toast';

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    role: 'driver' as const,
    shift: '1 shift' as const,
    active: true,
    requiresPassword: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast({
        title: "Error",
        description: "El nombre de usuario es requerido",
        variant: "destructive",
      });
      return;
    }

    const existingUser = users.find(u => 
      u.username.toLowerCase() === formData.username.toLowerCase() && 
      u.id !== editingUser
    );
    
    if (existingUser) {
      toast({
        title: "Error",
        description: "Ya existe un usuario con ese nombre",
        variant: "destructive",
      });
      return;
    }

    if (editingUser) {
      updateUser(editingUser, formData);
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });
    } else {
      addUser(formData);
      toast({
        title: "Éxito",
        description: "Usuario creado correctamente",
      });
    }

    setFormData({
      username: '',
      role: 'driver',
      shift: '1 shift',
      active: true,
      requiresPassword: false,
    });
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEdit = (user: any) => {
    setFormData({
      username: user.username,
      role: user.role,
      shift: user.shift,
      active: user.active,
      requiresPassword: user.requiresPassword || false,
    });
    setEditingUser(user.id);
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    if (userId === '1') {
      toast({
        title: "Error",
        description: "No se puede eliminar el usuario administrador",
        variant: "destructive",
      });
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      deleteUser(userId);
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });
    }
  };

  const toggleUserStatus = (userId: string, currentStatus: boolean) => {
    if (userId === '1') {
      toast({
        title: "Error",
        description: "No se puede desactivar el usuario administrador",
        variant: "destructive",
      });
      return;
    }

    updateUser(userId, { active: !currentStatus });
    toast({
      title: "Éxito",
      description: `Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUser(null);
            setFormData({
              username: '',
              role: 'driver',
              shift: '1 shift',
              active: true,
              requiresPassword: false,
            });
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* User Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {ROLES.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Turno
              </label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {SHIFTS.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Usuario activo</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.requiresPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresPassword: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Requiere contraseña</span>
              </label>
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingUser ? 'Actualizar' : 'Crear'} Usuario
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        {user.requiresPassword && (
                          <div className="text-xs text-gray-500">Requiere contraseña</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.shift}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.active)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.active ? (
                        <>
                          <UserCheck className="h-3 w-3 mr-1" />
                          Activo
                        </>
                      ) : (
                        <>
                          <UserX className="h-3 w-3 mr-1" />
                          Inactivo
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary hover:text-primary/80 p-1"
                        title="Editar usuario"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      {user.id !== '1' && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;


import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit2, Trash2, Image, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ROLES } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { toast } from '@/hooks/use-toast';

interface AlertButton {
  id: string;
  name: string;
  image?: string;
  color: string;
  allowedRoles: string[];
}

const ButtonManagement: React.FC = () => {
  const { alertButtons, addAlertButton, updateAlertButton, deleteAlertButton } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<AlertButton | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    color: '#ef4444',
    allowedRoles: ['press'] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del botón es requerido",
        variant: "destructive"
      });
      return;
    }

    if (formData.allowedRoles.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un rol",
        variant: "destructive"
      });
      return;
    }

    if (editingButton) {
      updateAlertButton(editingButton.id, {
        name: formData.name,
        image: formData.image,
        color: formData.color,
        allowedRoles: formData.allowedRoles
      });
      toast({
        title: "Botón actualizado",
        description: `El botón "${formData.name}" ha sido actualizado exitosamente`
      });
    } else {
      addAlertButton({
        name: formData.name,
        image: formData.image,
        color: formData.color,
        allowedRoles: formData.allowedRoles
      });
      toast({
        title: "Botón creado",
        description: `El botón "${formData.name}" ha sido creado exitosamente`
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      color: '#ef4444',
      allowedRoles: ['press']
    });
    setEditingButton(null);
  };

  const handleEdit = (button: AlertButton) => {
    setEditingButton(button);
    setFormData({
      name: button.name,
      image: button.image || '',
      color: button.color,
      allowedRoles: button.allowedRoles || ['press']
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el botón "${name}"?`)) {
      deleteAlertButton(id);
      toast({
        title: "Botón eliminado",
        description: `El botón "${name}" ha sido eliminado`
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      allowedRoles: prev.allowedRoles.includes(role)
        ? prev.allowedRoles.filter(r => r !== role)
        : [...prev.allowedRoles, role]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Botones de Alerta</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Botón
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingButton ? 'Editar Botón' : 'Crear Nuevo Botón'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Botón</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Emergencia, Mantenimiento..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color del Botón</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#ef4444"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Roles Permitidos</Label>
                <div className="space-y-2">
                  {ROLES.map(role => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.allowedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{role}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Admin y Supervisor siempre ven todos los botones</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagen del Botón (Opcional)</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.image && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingButton ? 'Actualizar' : 'Crear'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="card p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertButtons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No hay botones configurados
                </TableCell>
              </TableRow>
            ) : (
              alertButtons.map((button) => (
                <TableRow key={button.id}>
                  <TableCell>
                    {button.image ? (
                      <img
                        src={button.image}
                        alt={button.name}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded border flex items-center justify-center">
                        <Image className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{button.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: button.color }}
                      />
                      <span className="text-sm text-gray-600">{button.color}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(button.allowedRoles || []).map(role => (
                        <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                          {role}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(button)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(button.id, button.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ButtonManagement;

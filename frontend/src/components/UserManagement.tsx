import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Shield, Eye, Save, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import ProtectedAction from './ProtectedAction'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  region: string
  created_at?: string
}

const UserManagement: React.FC = () => {
  const { canAdmin, user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    region: 'TODAS'
  })

  const regions = ['TODAS', 'CECA', 'SOLA', 'MX', 'SNAP', 'COEC']
  const roles = [
    { value: 'admin', label: 'Administrador', icon: Shield, desc: 'Acceso completo al sistema' },
    { value: 'editor', label: 'Editor', icon: User, desc: 'Puede crear y editar contenido' },
    { value: 'viewer', label: 'Visualizador', icon: Eye, desc: 'Solo lectura y comentarios' }
  ]

  // Simular carga de usuarios (en producción vendría de la API)
  useEffect(() => {
    const mockUsers: User[] = [
      { id: 1, name: 'Admin User', email: 'admin@emx.com', role: 'admin', region: 'TODAS', created_at: '2024-01-15' },
      { id: 2, name: 'Editor User', email: 'editor@emx.com', role: 'editor', region: 'CECA', created_at: '2024-02-10' },
      { id: 3, name: 'Viewer User', email: 'viewer@emx.com', role: 'viewer', region: 'SOLA', created_at: '2024-03-05' },
      { id: 4, name: 'María González', email: 'maria.gonzalez@emx.com', role: 'editor', region: 'MX', created_at: '2024-03-20' },
      { id: 5, name: 'Carlos Ruiz', email: 'carlos.ruiz@emx.com', role: 'viewer', region: 'SNAP', created_at: '2024-04-01' }
    ]
    setUsers(mockUsers)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingUser) {
      // Actualizar usuario existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ))
    } else {
      // Crear nuevo usuario
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
    }

    resetForm()
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region
    })
    setIsModalOpen(true)
  }

  const handleDelete = (userId: number) => {
    if (userId === currentUser?.id) {
      alert('No puedes eliminar tu propio usuario')
      return
    }
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'viewer',
      region: 'TODAS'
    })
    setEditingUser(null)
    setIsModalOpen(false)
  }

  const getRoleInfo = (role: string) => {
    return roles.find(r => r.value === role) || roles[2]
  }

  if (!canAdmin()) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
        <p className="text-gray-600">Solo los administradores pueden gestionar usuarios.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administra usuarios y sus permisos en el sistema</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Región
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const roleInfo = getRoleInfo(user.role)
              const RoleIcon = roleInfo.icon
              
              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <RoleIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {roleInfo.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <div className="space-y-2">
                  {roles.map((role) => {
                    const RoleIcon = role.icon
                    return (
                      <label key={role.value} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                          className="text-blue-600"
                        />
                        <RoleIcon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-gray-500">{role.desc}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Región
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'Actualizar' : 'Crear'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement

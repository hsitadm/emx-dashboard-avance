import React, { useState } from 'react'
import { Plus, Edit, Trash2, User, Shield, Eye } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const UserManagement: React.FC = () => {
  const { canAdmin, user: currentUser } = useAuthStore()
  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@emx.com', role: 'admin', region: 'TODAS' },
    { id: 2, name: 'Editor User', email: 'editor@emx.com', role: 'editor', region: 'CECA' },
    { id: 3, name: 'Viewer User', email: 'viewer@emx.com', role: 'viewer', region: 'SOLA' }
  ])

  console.log('UserManagement rendered', { canAdmin: canAdmin(), currentUser })

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
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Simple Users List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Usuarios Registrados</h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium capitalize">{user.role}</div>
                  <div className="text-xs text-gray-500">{user.region}</div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  {user.id !== currentUser?.id && (
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Debug Info:</h4>
        <pre className="text-sm">
          {JSON.stringify({ 
            currentUser, 
            canAdmin: canAdmin(),
            usersCount: users.length 
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default UserManagement

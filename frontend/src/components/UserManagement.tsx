import React from 'react'
import { Users, Shield, Edit, Eye } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const UserManagement: React.FC = () => {
const handleResetPassword = async (email: string) => {    if (confirm(`¿Reset password para ${email}?`)) {      try {        // Aquí iría la llamada a la API para reset password        alert(`Password reset enviado a ${email}`)      } catch (error) {        alert("Error al resetear password")      }    }  }
  const { canAdmin } = useAuthStore()

  if (!canAdmin()) {
    return (
      <div className="p-6 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">Acceso Denegado</h2>
        <p className="text-gray-500">Solo los administradores pueden gestionar usuarios</p>
      </div>
    )
  }

  const users = [
    {
      email: 'hsandoval@escala24x7.com',
      name: 'Hector Sandoval',
      role: 'admin',
      region: 'TODAS',
      status: 'Activo'
    },
    {
      email: 'editor@emx.com',
      name: 'Usuario Editor',
      role: 'editor',
      region: 'SOLA',
      status: 'Cambio de Password'
    },
    {
      email: 'viewer@emx.com',
      name: 'Usuario Viewer',
      role: 'viewer',
      region: 'CECA',
      status: 'Cambio de Password'
    }
  ]

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-600" />
      case 'editor': return <Edit className="w-4 h-4 text-blue-600" />
      case 'viewer': return <Eye className="w-4 h-4 text-green-600" />
      default: return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600">AWS Cognito User Pool: us-east-1_A7TjCD2od</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Región
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <span className="text-sm font-medium capitalize">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Gestión de Usuarios</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Crear usuarios:</strong> AWS CLI o Console</p>
          <p><strong>Asignar roles:</strong> custom:role (admin, editor, viewer)</p>
          <p><strong>Asignar región:</strong> custom:region (TODAS, CECA, SOLA, etc.)</p>
        </div>
      </div>
    </div>
  )
}


export default UserManagement

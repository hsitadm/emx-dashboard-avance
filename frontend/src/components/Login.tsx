import { useState } from 'react'
import { useStore } from '../store/useStore'
import { LogIn } from 'lucide-react'

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('')
  const [name, setName] = useState('')
  const setUser = useStore(state => state.setUser)

  const roles = [
    { value: 'director', label: 'Director' },
    { value: 'regional', label: 'Regional' },
    { value: 'service-delivery', label: 'Service Delivery Lead' },
    { value: 'emx-champion', label: 'EMx Champion' },
    { value: 'emx-leader', label: 'Líder EMx' },
    { value: 'collaborator', label: 'Colaborador' }
  ]

  const handleLogin = () => {
    if (name && selectedRole) {
      setUser({
        id: Date.now().toString(),
        name,
        role: selectedRole as any
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EMx Dashboard</h1>
          <p className="text-gray-600">Gestión de Transición al Nuevo Servicio</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ingresa tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecciona tu rol</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleLogin}
            disabled={!name || !selectedRole}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Acceder al Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

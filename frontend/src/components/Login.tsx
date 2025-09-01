import React, { useState } from 'react'
import { LogIn, User, Shield, Eye } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const login = useAuthStore(state => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email)
    } catch (error) {
      setError('Error en login. Verifica tu email.')
    } finally {
      setLoading(false)
    }
  }

  const testUsers = [
    { email: 'admin@emx.com', role: 'Admin', icon: Shield, desc: 'Acceso completo' },
    { email: 'editor@emx.com', role: 'Editor', icon: User, desc: 'Puede editar' },
    { email: 'viewer@emx.com', role: 'Viewer', icon: Eye, desc: 'Solo lectura' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EMx Dashboard</h1>
          <p className="text-gray-600 mt-2">Ingresa tu email para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu-email@emx.com"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Usuarios de prueba:</p>
          <div className="space-y-2">
            {testUsers.map((user) => {
              const Icon = user.icon
              return (
                <button
                  key={user.email}
                  onClick={() => setEmail(user.email)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-3"
                >
                  <Icon className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="font-medium text-sm">{user.role}</div>
                    <div className="text-xs text-gray-500">{user.desc}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">{user.email}</div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

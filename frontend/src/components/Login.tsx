import React, { useState } from 'react'
import { LogIn, User, Shield, Eye } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, loginAsViewer } = useAuthStore()

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

  const handleViewerAccess = () => {
    loginAsViewer()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EMx Dashboard</h1>
          <p className="text-gray-600 mt-2">Accede al dashboard de transición</p>
        </div>

        {/* Acceso directo como Viewer */}
        <div className="mb-6">
          <button
            onClick={handleViewerAccess}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>Acceder como Visualizador</span>
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Acceso de solo lectura - No requiere credenciales
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O ingresa como administrador</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email de Administrador
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@emx.com"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>{loading ? 'Ingresando...' : 'Ingresar como Admin'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Usuario de prueba:</p>
          <button
            onClick={() => setEmail('admin@emx.com')}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-3"
          >
            <Shield className="w-4 h-4 text-gray-600" />
            <div>
              <div className="font-medium text-sm">Administrador</div>
              <div className="text-xs text-gray-500">Acceso completo al sistema</div>
            </div>
            <div className="ml-auto text-xs text-gray-400">admin@emx.com</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

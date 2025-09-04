import React, { useState } from 'react'
import { Shield, LogIn, Key, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Login: React.FC = () => {
  const [email, setEmail] = useState('hsandoval@escala24x7.com')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, changePassword, needsPasswordChange } = useAuthStore()

  const validateEmail = (email: string) => {
    return email.endsWith('@escala24x7.com')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setError('Solo se permiten usuarios con dominio @escala24x7.com')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (error: any) {
      if (error.message === 'NEW_PASSWORD_REQUIRED') {
        setError('Debes cambiar tu password temporal')
      } else {
        setError(error.message || 'Error en login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 12) {
      setError('La contraseña debe tener al menos 12 caracteres con mayúsculas, minúsculas, números y símbolos')
      return
    }

    setLoading(true)
    setError('')

    try {
      await changePassword(newPassword)
    } catch (error: any) {
      setError(error.message || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (needsPasswordChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Key className="mx-auto w-16 h-16 text-orange-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Cambiar Contraseña</h1>
            <p className="text-gray-600 mt-2">Política: 12+ caracteres, mayúsculas, minúsculas, números y símbolos</p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Mínimo 12 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Repetir contraseña"
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
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Shield className="mx-auto w-16 h-16 text-blue-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">EMx Dashboard</h1>
          <p className="text-gray-600 mt-2">Acceso Corporativo Escala24x7</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="usuario@escala24x7.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Ingresando...' : 'Ingresar'}</span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
            <div><strong>Seguridad:</strong> Solo usuarios @escala24x7.com</div>
            <div><strong>Roles:</strong> Administrador y View Only</div>
            <div><strong>User Pool:</strong> us-east-1_A7TjCD2od</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

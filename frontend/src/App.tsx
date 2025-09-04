import React, { useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { useAuthStore } from './store/authStore'
import './aws-config' // Configurar Amplify

function App() {
  const { isAuthenticated, loading, checkCurrentUser } = useAuthStore()

  useEffect(() => {
    checkCurrentUser()
  }, [checkCurrentUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando sesión Cognito...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return <Dashboard />
}

export default App
// Build timestamp: 1756991309

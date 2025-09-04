import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { useAuthStore } from './store/authStore'

function App() {
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, user, loginAsViewer } = useAuthStore()

  useEffect(() => {
    // Solo auto-login si no hay usuario y no se ha hecho logout manual
    const checkAuth = async () => {
      const hasLoggedOut = localStorage.getItem('hasLoggedOut')
      
      if (!isAuthenticated && !hasLoggedOut) {
        loginAsViewer()
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [isAuthenticated, loginAsViewer])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  )
}

export default App

import { useEffect } from 'react'
import { useStore } from './store/useStore'
import Dashboard from './components/Dashboard'
import apiService from './services/api.js'

function App() {
  const { setUser, loadTasks, addNotification } = useStore()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Cargar usuario actual
        const user = await apiService.getCurrentUser()
        setUser({
          id: user.id.toString(),
          name: user.name,
          role: user.role,
          region: user.region
        })

        // Cargar tareas
        await loadTasks()

        addNotification({
          message: `¡Bienvenido ${user.name}! Datos EMx cargados correctamente.`,
          type: 'success'
        })
      } catch (error) {
        console.error('Error initializing app:', error)
        // Fallback a usuario demo si falla la API
        setUser({
          id: '1',
          name: 'Usuario Demo',
          role: 'director',
          region: 'TODAS'
        })
        
        addNotification({
          message: 'Usando datos de demostración. Verifica que el backend esté ejecutándose.',
          type: 'warning'
        })
      }
    }

    initializeApp()
  }, [setUser, loadTasks, addNotification])

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  )
}

export default App

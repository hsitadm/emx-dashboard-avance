import { useEffect } from 'react'
import { useStore } from './store/useStore'
import Dashboard from './components/Dashboard'

function App() {
  const setUser = useStore(state => state.setUser)

  // Simular usuario logueado para desarrollo
  useEffect(() => {
    setUser({
      id: '1',
      name: 'Usuario Demo',
      role: 'emx-leader'
    })
  }, [setUser])

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  )
}

export default App

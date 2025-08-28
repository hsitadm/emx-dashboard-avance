import { useEffect } from 'react'
import { useStore } from './store/useStore'
import Header from './components/Header'
import ProgressOverview from './components/ProgressOverview'
import Charts from './components/Charts'
import TaskBoard from './components/TaskBoard'
import MilestoneTimeline from './components/MilestoneTimeline'

function App() {
  const setUser = useStore(state => state.setUser)

  useEffect(() => {
    setUser({
      id: '1',
      name: 'Usuario Demo',
      role: 'emx-leader'
    })
  }, [setUser])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard EMx</h1>
          <p className="text-gray-600 mt-2">Dashboard de Transición EMx - Usuario Demo</p>
        </div>

        <div className="space-y-8">
          <ProgressOverview />
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Análisis Visual</h2>
            <Charts />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskBoard />
            </div>
            <div>
              <MilestoneTimeline />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

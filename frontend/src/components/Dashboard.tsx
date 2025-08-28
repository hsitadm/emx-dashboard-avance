import { useStore } from '../store/useStore'
import Header from './Header'
import ProgressOverview from './ProgressOverview'
import TaskBoard from './TaskBoard'
import MilestoneTimeline from './MilestoneTimeline'

const Dashboard = () => {
  const user = useStore(state => state.user)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Dashboard de Transición EMx - {user?.role}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProgressOverview />
            <TaskBoard />
          </div>
          
          <div className="space-y-8">
            <MilestoneTimeline />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

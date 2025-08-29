import { useState } from 'react'
import { useStore } from '../store/useStore'
import Header from './Header'
import ProgressOverview from './ProgressOverview'
import TaskBoard from './TaskBoard'
import MilestoneTimeline from './MilestoneTimeline'
import Charts from './Charts'
import KanbanBoard from './KanbanBoard'
import CalendarView from './CalendarView'
import Gamification from './Gamification'
import StoriesView from './StoriesView'
import { LayoutGrid, Calendar, Kanban, BarChart3, Trophy, BookOpen, CheckSquare } from 'lucide-react'

const Dashboard = () => {
  const user = useStore(state => state.user)
  const [activeView, setActiveView] = useState('overview')

  const views = [
    { id: 'overview', label: 'Resumen', icon: LayoutGrid },
    { id: 'stories', label: 'Historias', icon: BookOpen },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare },
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
    { id: 'gamification', label: 'Logros', icon: Trophy }
  ]

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

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeView === view.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <view.icon size={16} />
                  {view.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content based on active view */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Solo historias y métricas en el resumen */}
            <ProgressOverview />
            
            {/* Hitos como información complementaria */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hitos del Proyecto</h3>
              <MilestoneTimeline />
            </div>
          </div>
        )}

        {activeView === 'stories' && <StoriesView />}

        {activeView === 'tasks' && <TaskBoard />}

        {activeView === 'kanban' && <KanbanBoard />}

        {activeView === 'calendar' && <CalendarView />}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Análisis Visual</h2>
              <Charts />
            </div>
            <ProgressOverview />
          </div>
        )}

        {activeView === 'gamification' && <Gamification />}
      </main>
    </div>
  )
}

export default Dashboard

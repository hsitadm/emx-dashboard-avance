import { useState } from 'react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/authStore'
import Header from './Header'
import ProgressOverview from './ProgressOverview'
import TaskBoard from './TaskBoard'
import MilestoneTimeline from './MilestoneTimeline'
import MilestonesView from './MilestonesView'
import Charts from './Charts'
import KanbanBoard from './KanbanBoard'
import CalendarView from './CalendarView'
import Gamification from './Gamification'
import StoriesView from './StoriesView'
import { LayoutGrid, Calendar, Kanban, BarChart3, Trophy, BookOpen, CheckSquare, Target, LogOut, User } from 'lucide-react'

const Dashboard = () => {
  const user = useStore(state => state.user)
  const { user: authUser, canView, logout } = useAuthStore()
  const [activeView, setActiveView] = useState('overview')

  const allViews = [
    { id: 'overview', label: 'Resumen', icon: LayoutGrid, key: 'dashboard' },
    { id: 'stories', label: 'Historias', icon: BookOpen, key: 'stories' },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, key: 'tasks' },
    { id: 'milestones', label: 'Hitos', icon: Target, key: 'milestones' },
    { id: 'kanban', label: 'Kanban', icon: Kanban, key: 'kanban' },
    { id: 'calendar', label: 'Calendario', icon: Calendar, key: 'calendar' },
    { id: 'analytics', label: 'Análisis', icon: BarChart3, key: 'analytics' },
    { id: 'gamification', label: 'Logros', icon: Trophy, key: 'gamification' }
  ]

  // Filtrar vistas según permisos del usuario
  const views = allViews.filter(view => canView(view.key))

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con info de usuario */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EMx Dashboard</h1>
              <p className="text-sm text-gray-600">Gestión de Transición</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{authUser?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{authUser?.role} • {authUser?.region}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {views.map((view) => {
                const Icon = view.icon
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeView === view.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{view.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeView === 'overview' && (
            <>
              <ProgressOverview />
              <MilestoneTimeline />
            </>
          )}
          {activeView === 'stories' && <StoriesView />}
          {activeView === 'tasks' && <TaskBoard />}
          {activeView === 'milestones' && <MilestonesView />}
          {activeView === 'kanban' && <KanbanBoard />}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'analytics' && <Charts />}
          {activeView === 'gamification' && <Gamification />}
        </div>

        {/* Role-based message for viewers */}
        {authUser?.role === 'viewer' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                <strong>Modo Solo Lectura:</strong> Puedes ver el resumen, análisis y calendario. 
                Para editar contenido, contacta a tu administrador.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

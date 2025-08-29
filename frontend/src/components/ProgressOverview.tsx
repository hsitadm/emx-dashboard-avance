import { useState, useEffect } from 'react'
import { TrendingUp, Users, CheckCircle, Clock, BookOpen, Target } from 'lucide-react'
import apiService from '../services/api.js'

const ProgressOverview = () => {
  const [stories, setStories] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    totalStories: 0,
    completedStories: 0,
    totalTasks: 0,
    completedTasks: 0,
    generalProgress: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [storiesData, dashboardData] = await Promise.all([
        apiService.request('/stories'),
        apiService.getDashboardMetrics()
      ])
      
      setStories(storiesData)
      
      const completedStories = storiesData.filter((s: any) => s.status === 'completed').length
      const avgProgress = storiesData.reduce((acc: number, story: any) => acc + (story.progress || 0), 0) / storiesData.length || 0
      
      setMetrics({
        totalStories: storiesData.length,
        completedStories,
        totalTasks: dashboardData.totalTasks,
        completedTasks: dashboardData.completedTasks,
        generalProgress: Math.round(avgProgress)
      })
    } catch (error) {
      console.error('Error loading overview data:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'active': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const metricsCards = [
    {
      title: 'Historias Completadas',
      value: `${metrics.completedStories}/${metrics.totalStories}`,
      change: `${Math.round((metrics.completedStories / metrics.totalStories) * 100) || 0}% del proyecto`,
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Progreso General',
      value: `${metrics.generalProgress}%`,
      change: 'Basado en historias',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Tareas Completadas',
      value: `${metrics.completedTasks}/${metrics.totalTasks}`,
      change: 'Todas las historias',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Días Restantes',
      value: '45',
      change: 'Para Q4 2025',
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen Ejecutivo del Proyecto EMx</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsCards.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-3`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 mb-1">
                {metric.title}
              </div>
              <div className="text-xs text-green-600 font-medium">
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Barra de Progreso General */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Progreso General del Proyecto</span>
            <span className="text-gray-500">{metrics.generalProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${metrics.generalProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            El progreso se calcula en base al avance de las historias principales del proyecto
          </p>
        </div>
      </div>

      {/* Historias Principales - Vista Resumida */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            Estado de las Historias
          </h3>
          <span className="text-sm text-gray-500">Vista ejecutiva</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((story, index) => (
            <div key={story.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-gray-900">{story.title}</h4>
                  {story.status === 'completed' && (
                    <Target className="w-4 h-4 text-green-600" title="Convertida en hito" />
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(story.status)}`}>
                  {story.status === 'completed' ? 'Completada' : 
                   story.status === 'in-progress' ? 'En Progreso' : 'Activa'}
                </span>
              </div>
              
              {/* Barra de progreso compacta */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{story.completed_tasks || 0}/{story.task_count || 0} tareas</span>
                  <span>{story.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      story.status === 'completed' ? 'bg-green-500' : 'bg-primary-600'
                    }`}
                    style={{ width: `${story.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Users size={12} />
                  <span>{story.assignee_name || 'Sin asignar'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>{story.target_date ? new Date(story.target_date).toLocaleDateString() : 'Sin fecha'}</span>
                </div>
                <div className={`flex items-center gap-1 ${getPriorityColor(story.priority)}`}>
                  <span>●</span>
                  <span className="capitalize">{story.priority}</span>
                </div>
              </div>
            </div>
          ))}

          {stories.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay historias disponibles</p>
              <p className="text-sm">Ve a la pestaña Historias para crear la primera</p>
            </div>
          )}
        </div>

        {stories.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Para gestión detallada de historias y tareas, utiliza las pestañas correspondientes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgressOverview

import { useState, useEffect } from 'react'
import { TrendingUp, Users, CheckCircle, Clock, BookOpen, Target } from 'lucide-react'
import apiService from '../services/api.js'
import { mockStories, getTasksByStoryId } from '../data/mockData'

const ProgressOverview = () => {
  const [stories, setStories] = useState<any[]>([])
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [storyTasks, setStoryTasks] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
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
      const [storiesData, dashboardData, milestonesData] = await Promise.all([
        apiService.request('/stories'),
        apiService.getDashboardMetrics(),
        apiService.request('/milestones')
      ])
      
      setStories(storiesData)
      setMilestones(milestonesData)
      
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
      console.error('Error loading data:', error)
      // Fallback to empty data
      setStories([])
      setMilestones([])
      setMetrics({
        totalStories: 0,
        completedStories: 0,
        totalTasks: 0,
        completedTasks: 0,
        generalProgress: 0
      })
    }
  }

  const loadStoryTasks = async (storyId: number) => {
    try {
      const tasks = await apiService.request(`/stories/${storyId}/tasks`)
      setStoryTasks(tasks)
    } catch (error) {
      console.error('Error loading story tasks:', error)
      setStoryTasks([])
    }
  }

  const handleStoryClick = (story: any) => {
    if (selectedStory?.id === story.id) {
      setSelectedStory(null)
      setStoryTasks([])
    } else {
      setSelectedStory(story)
      loadStoryTasks(story.id)
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
            <div 
              key={story.id} 
              onClick={() => handleStoryClick(story)}
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                selectedStory?.id === story.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-sm'
              }`}
            >
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

        {/* Detalles de Historia Seleccionada */}
        {selectedStory && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                {selectedStory.title}
              </h3>
              
              {selectedStory.description && (
                <p className="text-sm text-gray-600 mb-4">{selectedStory.description}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <div className={`mt-1 px-2 py-1 rounded text-xs font-medium inline-block ${
                    selectedStory.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedStory.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedStory.status === 'completed' ? 'Completada' : 
                     selectedStory.status === 'in-progress' ? 'En Progreso' : 'Activa'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Responsable:</span>
                  <div className="mt-1 font-medium">{selectedStory.assignee_name || 'Sin asignar'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Fecha objetivo:</span>
                  <div className="mt-1 font-medium">
                    {selectedStory.target_date ? new Date(selectedStory.target_date).toLocaleDateString() : 'Sin fecha'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Progreso:</span>
                  <div className="mt-1 font-medium">{selectedStory.progress || 0}%</div>
                </div>
              </div>

              {/* Resumen de tareas */}
              {storyTasks.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Resumen de tareas</h4>
                    <span className="text-sm text-gray-500">
                      {storyTasks.filter(t => t.status === 'completed').length} de {storyTasks.length} completadas
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-700 text-lg">
                        {storyTasks.filter(t => t.status === 'completed').length}
                      </div>
                      <div className="text-green-600">Completadas</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-700 text-lg">
                        {storyTasks.filter(t => t.status === 'in-progress').length}
                      </div>
                      <div className="text-blue-600">En Progreso</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-700 text-lg">
                        {storyTasks.filter(t => t.status === 'planning').length}
                      </div>
                      <div className="text-gray-600">Pendientes</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de tareas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tareas Asociadas ({storyTasks.length})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {storyTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            task.status === 'completed' ? 'bg-green-500' : 
                            task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></div>
                          <h5 className="font-medium text-gray-900 text-sm">{task.title}</h5>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status === 'completed' ? 'Completada' :
                           task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span>👤 {task.assignee_name || 'Sin asignar'}</span>
                          {task.due_date && (
                            <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{task.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {storyTasks.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No hay tareas asignadas a esta historia</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {stories.length > 0 && !selectedStory && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              <strong>💡 Tip:</strong> Haz clic en cualquier historia para ver sus tareas asociadas
            </p>
          </div>
        )}
      </div>

      {/* Resumen de Hitos */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            Resumen de Hitos
          </h3>
          <span className="text-sm text-gray-500">Estado general</span>
        </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 mb-3">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">
                {milestones.filter(m => m.status === 'completed').length}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Hitos Completados
              </div>
              <div className="text-xs text-green-500 mt-1">
                Objetivos alcanzados
              </div>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 mb-3">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-700 mb-1">
                {milestones.filter(m => m.status !== 'completed').length}
              </div>
              <div className="text-sm text-orange-600 font-medium">
                Hitos Pendientes
              </div>
              <div className="text-xs text-orange-500 mt-1">
                Por completar
              </div>
            </div>
          </div>

          {/* Lista de Hitos */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 mb-3">Detalle de Hitos del Proyecto</h4>
            {milestones.map((milestone) => (
              <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-500' : 
                      milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                    milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.status === 'completed' ? 'Completado' :
                     milestone.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                  </span>
                </div>
                
                {milestone.description && (
                  <p className="text-sm text-gray-600 mb-2 ml-6">{milestone.description}</p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 ml-6">
                  <span>📅 {new Date(milestone.due_date).toLocaleDateString()}</span>
                  <span className={`${
                    milestone.priority === 'high' ? 'text-red-600' :
                    milestone.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    ● {milestone.priority === 'high' ? 'Alta' : milestone.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
              </div>
            ))}
            {milestones.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay hitos definidos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressOverview

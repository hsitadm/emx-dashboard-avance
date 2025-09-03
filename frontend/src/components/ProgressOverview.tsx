import { useState, useEffect } from 'react'
import { TrendingUp, Target, CheckCircle, Clock, AlertTriangle, BookOpen, Calendar, ChevronDown, ChevronRight } from 'lucide-react'
import api from '../services/api.js'

const ProgressOverview = () => {
  const [milestones, setMilestones] = useState<any[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [expandedStory, setExpandedStory] = useState<number | null>(null)
  const [showAllTasks, setShowAllTasks] = useState<{[key: number]: boolean}>({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    milestoneStatus: 'all',
    storyStatus: 'all',
    showCompleted: true
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [milestonesData, storiesData, tasksData] = await Promise.all([
        api.getMilestones(),
        api.getStories(),
        api.getTasks()
      ])
      setMilestones(milestonesData)
      setStories(storiesData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTasksByStoryId = (storyId: number) => {
    return tasks.filter(task => task.story_id === storyId)
  }

  const toggleStoryExpansion = (storyId: number) => {
    setExpandedStory(expandedStory === storyId ? null : storyId)
  }

  const getFilteredMilestones = () => {
    return milestones.filter(milestone => {
      if (filters.milestoneStatus !== 'all' && milestone.status !== filters.milestoneStatus) return false
      if (!filters.showCompleted && milestone.status === 'completed') return false
      return true
    })
  }

  const getFilteredStories = () => {
    return stories.filter(story => {
      if (filters.storyStatus !== 'all' && story.status !== filters.storyStatus) return false
      if (!filters.showCompleted && story.status === 'completed') return false
      return true
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />
      case 'in-progress': return <Clock size={16} />
      case 'planning': return <Target size={16} />
      default: return <AlertTriangle size={16} />
    }
  }

  const getRiskLevel = (milestone: any) => {
    const dueDate = new Date(milestone.due_date)
    const today = new Date()
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (milestone.status === 'completed') return 'success'
    if (daysUntilDue < 0) return 'overdue'
    if (daysUntilDue <= 7 && milestone.progress < 80) return 'high'
    if (daysUntilDue <= 14 && milestone.progress < 60) return 'medium'
    return 'low'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'success': return 'border-l-green-500 bg-green-50'
      case 'overdue': return 'border-l-red-500 bg-red-50'
      case 'high': return 'border-l-red-400 bg-red-50'
      case 'medium': return 'border-l-yellow-400 bg-yellow-50'
      default: return 'border-l-blue-400 bg-blue-50'
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'success': return '✅ Completado'
      case 'overdue': return '🚨 Vencido'
      case 'high': return '🔴 Alto Riesgo'
      case 'medium': return '🟡 Riesgo Medio'
      default: return '🟢 Bajo Riesgo'
    }
  }

  // Calculate overall metrics
  const filteredMilestones = getFilteredMilestones()
  const filteredStories = getFilteredStories()
  const totalMilestones = filteredMilestones.length
  const completedMilestones = filteredMilestones.filter(m => m.status === 'completed').length
  const overallProgress = totalMilestones > 0 ? Math.round(filteredMilestones.reduce((sum, m) => sum + m.progress, 0) / totalMilestones) : 0
  const atRiskMilestones = filteredMilestones.filter(m => ['overdue', 'high'].includes(getRiskLevel(m))).length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Progreso General</p>
              <p className="text-2xl font-semibold text-gray-900">{overallProgress}%</p>
            </div>
            <TrendingUp size={24} className="text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Hitos Completados</p>
              <p className="text-2xl font-semibold text-gray-900">{completedMilestones}/{totalMilestones}</p>
            </div>
            <CheckCircle size={24} className="text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">En Riesgo</p>
              <p className="text-2xl font-semibold text-gray-900">{atRiskMilestones}</p>
            </div>
            <AlertTriangle size={24} className="text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Historias Activas</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredStories.length}</p>
            </div>
            <BookOpen size={24} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div>
        <div className="bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="text-white" size={24} />
              <h2 className="text-xl font-semibold text-white">🎯 Hitos Estratégicos</h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filters.milestoneStatus}
                onChange={(e) => setFilters({...filters, milestoneStatus: e.target.value})}
                className="text-sm px-3 py-1 rounded border border-gray-300 bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="planning">Planificación</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completados</option>
              </select>
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={filters.showCompleted}
                  onChange={(e) => setFilters({...filters, showCompleted: e.target.checked})}
                  className="rounded"
                />
                Mostrar completados
              </label>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredMilestones.map((milestone) => {
            const risk = getRiskLevel(milestone)
            return (
              <div key={milestone.id} className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${getRiskColor(risk)}`}>
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{milestone.title}</h3>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">Progreso</span>
                      <span className="text-xs font-semibold text-gray-900">{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gray-600 h-1 rounded-full transition-all duration-500" 
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar size={10} />
                      {new Date(milestone.due_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {getRiskText(risk).split(' ')[0]}
                    </span>
                  </div>

                  {/* Connected Stories */}
                  {milestone.story_titles && milestone.story_titles.length > 0 && (
                    <div className="text-xs text-gray-500">
                      📖 {milestone.stories_count} historias
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stories Section */}
      <div>
        <div className="bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="text-white" size={24} />
              <h2 className="text-xl font-semibold text-white">📖 Historias del Proyecto</h2>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filters.storyStatus}
                onChange={(e) => setFilters({...filters, storyStatus: e.target.value})}
                className="text-sm px-3 py-1 rounded border border-gray-300 bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="planning">Planificación</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completadas</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStories.map((story) => {
            const storyTasks = getTasksByStoryId(story.id)
            const isExpanded = expandedStory === story.id
            
            return (
              <div key={story.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div 
                  className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleStoryExpansion(story.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">{story.title}</h3>
                    {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  </div>
                  
                  {/* Story Progress */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">Progreso</span>
                      <span className="text-xs font-semibold text-gray-900">{Math.round(story.story_progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gray-600 h-1 rounded-full transition-all duration-500" 
                        style={{ width: `${story.story_progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Story Metadata */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                      📋 {storyTasks.length}
                    </span>
                    {story.milestone_title && (
                      <span 
                        className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs cursor-help"
                        title={story.milestone_title}
                      >
                        🎯 {story.milestone_title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Tasks */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-semibold text-gray-900">
                        Tareas ({storyTasks.length})
                      </h4>
                      {storyTasks.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowAllTasks(prev => ({
                              ...prev,
                              [story.id]: !prev[story.id]
                            }))
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {showAllTasks[story.id] ? 'Ver menos' : 'Ver todas'}
                        </button>
                      )}
                    </div>
                    {storyTasks.length > 0 ? (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {(showAllTasks[story.id] ? storyTasks : storyTasks.slice(0, 3)).map((task) => (
                          <div key={task.id} className="bg-white rounded p-2 border border-gray-200">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="text-xs font-medium text-gray-900 flex-1 pr-1 line-clamp-1">{task.title}</h5>
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-xs ${
                                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {task.progress}%
                                </span>
                              </div>
                            </div>
                            {task.assignee_name && (
                              <p className="text-xs text-gray-500">👤 {task.assignee_name}</p>
                            )}
                          </div>
                        ))}
                        {!showAllTasks[story.id] && storyTasks.length > 3 && (
                          <p className="text-xs text-gray-500 text-center py-1">
                            +{storyTasks.length - 3} tareas más
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Sin tareas</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProgressOverview

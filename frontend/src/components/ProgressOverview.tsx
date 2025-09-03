import { useState, useEffect } from 'react'
import { TrendingUp, Target, CheckCircle, Clock, AlertTriangle, BookOpen, Calendar } from 'lucide-react'
import api from '../services/api.js'

const ProgressOverview = () => {
  const [milestones, setMilestones] = useState<any[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [milestonesData, storiesData] = await Promise.all([
        api.getMilestones(),
        api.getStories()
      ])
      setMilestones(milestonesData)
      setStories(storiesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
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
  const totalMilestones = milestones.length
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const overallProgress = totalMilestones > 0 ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / totalMilestones) : 0
  const atRiskMilestones = milestones.filter(m => ['overdue', 'high'].includes(getRiskLevel(m))).length

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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Progreso General</p>
              <p className="text-3xl font-bold">{overallProgress}%</p>
            </div>
            <TrendingUp size={32} className="text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Hitos Completados</p>
              <p className="text-3xl font-bold">{completedMilestones}/{totalMilestones}</p>
            </div>
            <CheckCircle size={32} className="text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">En Riesgo</p>
              <p className="text-3xl font-bold">{atRiskMilestones}</p>
            </div>
            <AlertTriangle size={32} className="text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Historias Activas</p>
              <p className="text-3xl font-bold">{stories.length}</p>
            </div>
            <BookOpen size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">🎯 Hitos Estratégicos</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {milestones.map((milestone) => {
            const risk = getRiskLevel(milestone)
            return (
              <div key={milestone.id} className={`bg-white rounded-xl p-6 shadow-lg border-l-4 ${getRiskColor(risk)} hover:shadow-xl transition-all duration-200`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso</span>
                        <span className="text-sm font-bold text-blue-600">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        {new Date(milestone.due_date).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                        {getStatusIcon(milestone.status)} {milestone.status === 'completed' ? 'Completado' : milestone.status === 'in-progress' ? 'En Progreso' : 'Planificación'}
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                        {getRiskText(risk)}
                      </span>
                    </div>

                    {/* Connected Stories */}
                    {milestone.story_titles && milestone.story_titles.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs text-gray-500 mb-1 block">
                          📖 {milestone.stories_count} historias conectadas
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {milestone.story_titles.slice(0, 3).map((storyTitle: string, index: number) => (
                            <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              {storyTitle.length > 20 ? storyTitle.substring(0, 20) + '...' : storyTitle}
                            </span>
                          ))}
                          {milestone.story_titles.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              +{milestone.story_titles.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stories Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-purple-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">📖 Historias del Proyecto</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{story.description}</p>
              
              {/* Story Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <span className="text-sm font-bold text-purple-600">{Math.round(story.story_progress || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${story.story_progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Story Metadata */}
              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(story.status)}`}>
                  {getStatusIcon(story.status)} {story.status === 'completed' ? 'Completada' : story.status === 'in-progress' ? 'En Progreso' : 'Planificación'}
                </span>
                {story.milestone_title && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    🎯 {story.milestone_title}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressOverview

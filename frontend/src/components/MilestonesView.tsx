import { useState, useEffect } from 'react'
import { Plus, Calendar, Target, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../services/api.js'

const MilestonesView = () => {
  const [milestones, setMilestones] = useState<any[]>([])
  const [stories, setStories] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStories, setSelectedStories] = useState<number[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'planning',
    region: ''
  })

  useEffect(() => {
    loadMilestones()
    loadStories()
  }, [])

  useEffect(() => {
    if (editingMilestone) {
      setFormData({
        title: editingMilestone.title || '',
        description: editingMilestone.description || '',
        due_date: editingMilestone.due_date || '',
        status: editingMilestone.status || 'planning',
        region: editingMilestone.region || ''
      })
      // Load connected stories
      const connectedStories = stories.filter(story => story.milestone_id === editingMilestone.id).map(story => story.id)
      setSelectedStories(connectedStories)
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'planning',
        region: ''
      })
      setSelectedStories([])
    }
  }, [editingMilestone, stories])

  const loadStories = async () => {
    try {
      const data = await api.getStories()
      setStories(data)
    } catch (error) {
      console.error('Error loading stories:', error)
    }
  }

  const loadMilestones = async () => {
    try {
      setLoading(true)
      const data = await api.getMilestones()
      setMilestones(data)
    } catch (error) {
      console.error('Error loading milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let milestone
      if (editingMilestone) {
        milestone = await api.updateMilestone(editingMilestone.id, formData)
      } else {
        milestone = await api.createMilestone(formData)
      }
      
      // Update stories with milestone_id
      if (selectedStories.length > 0) {
        for (const storyId of selectedStories) {
          await api.updateStory(storyId, { milestone_id: milestone.id || editingMilestone.id })
        }
      }
      
      await loadMilestones()
      await loadStories()
      setShowModal(false)
      setEditingMilestone(null)
      setSelectedStories([])
    } catch (error) {
      console.error('Error saving milestone:', error)
    }
  }

  const handleDeleteMilestone = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hito?')) {
      try {
        await api.deleteMilestone(id)
        await loadMilestones()
      } catch (error) {
        console.error('Error deleting milestone:', error)
        alert('Error al eliminar el hito. Puede tener historias asociadas.')
      }
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
      case 'completed': return <CheckCircle size={14} />
      case 'in-progress': return <Clock size={14} />
      case 'planning': return <AlertCircle size={14} />
      default: return <Target size={14} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in-progress': return 'En Progreso'
      case 'planning': return 'Planificación'
      default: return 'Desconocido'
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎯 Hitos del Proyecto EMx</h2>
          <p className="text-sm text-gray-600 mt-1">Objetivos estratégicos con progreso automático basado en historias</p>
        </div>
        <button 
          onClick={() => { setEditingMilestone(null); setShowModal(true) }}
          className="btn-primary flex items-center gap-2 px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus size={18} />
          Nuevo Hito
        </button>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {milestones.map((milestone) => {
          const risk = getRiskLevel(milestone)
          return (
            <div key={milestone.id} className={`bg-white rounded-lg p-3 shadow-sm border-l-4 ${getRiskColor(risk)}`}>
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{milestone.title}</h3>
                
                {/* Auto-calculated Progress */}
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
                  <div className="text-xs text-gray-500 mb-2">
                    📖 {milestone.stories_count} historias
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setEditingMilestone(milestone); setShowModal(true) }} 
                    className="flex-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteMilestone(milestone.id)} 
                    className="flex-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {milestones.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay hitos creados</h3>
          <p className="text-gray-500 mb-4">Crea tu primer hito para organizar las historias del proyecto</p>
          <button 
            onClick={() => { setEditingMilestone(null); setShowModal(true) }}
            className="btn-primary"
          >
            Crear Primer Hito
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingMilestone ? 'Editar Hito' : 'Nuevo Hito'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">Planificación</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las regiones</option>
                  <option value="CECA">CECA</option>
                  <option value="SOLA">SOLA</option>
                  <option value="MX">MX</option>
                  <option value="SNAP">SNAP</option>
                  <option value="COEC">COEC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Historias Conectadas</label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {stories.map((story) => (
                    <label key={story.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedStories.includes(story.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStories([...selectedStories, story.id])
                          } else {
                            setSelectedStories(selectedStories.filter(id => id !== story.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{story.title}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona las historias que pertenecen a este hito
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingMilestone ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MilestonesView

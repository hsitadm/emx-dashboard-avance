import { useState, useEffect } from 'react'
import { Plus, Calendar, Target, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import apiService from '../services/api.js'
import CommentsSection from './CommentsSection'

const MilestonesView = () => {
  const [milestones, setMilestones] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'planning',
    progress: 0
  })

  useEffect(() => {
    loadMilestones()
  }, [])

  useEffect(() => {
    if (editingMilestone) {
      setFormData({
        title: editingMilestone.title || '',
        description: editingMilestone.description || '',
        due_date: editingMilestone.due_date || '',
        status: editingMilestone.status || 'planning',
        progress: editingMilestone.progress || 0
      })
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'planning',
        progress: 0
      })
    }
  }, [editingMilestone])

  const loadMilestones = async () => {
    try {
      const data = await apiService.request('/milestones')
      setMilestones(data)
    } catch (error) {
      console.error('Error loading milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingMilestone) {
        await apiService.request(`/milestones/${editingMilestone.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        })
      } else {
        await apiService.request('/milestones', {
          method: 'POST',
          body: JSON.stringify(formData)
        })
      }
      
      setShowModal(false)
      setEditingMilestone(null)
      loadMilestones()
    } catch (error) {
      console.error('Error saving milestone:', error)
    }
  }

  const handleDelete = async (milestone: any) => {
    if (confirm(`¿Estás seguro de eliminar el hito "${milestone.title}"?`)) {
      try {
        await apiService.request(`/milestones/${milestone.id}`, { method: 'DELETE' })
        loadMilestones()
      } catch (error) {
        console.error('Error deleting milestone:', error)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={16} />
      case 'in-progress': return <Clock className="text-blue-600" size={16} />
      case 'planning': return <AlertCircle className="text-gray-600" size={16} />
      default: return <Target className="text-gray-600" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="card">Cargando hitos...</div>
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Hitos del Proyecto EMx</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Nuevo Hito
        </button>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(milestone.status)}
                  <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {milestone.status === 'completed' ? 'Completado' : 
                     milestone.status === 'in-progress' ? 'En Progreso' : 'Planificación'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                
                {/* Barra de progreso */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Progreso</span>
                    <span className="text-xs font-medium text-gray-700">{milestone.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${milestone.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingMilestone(milestone)
                    setShowModal(true)
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(milestone)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Fecha límite: {new Date(milestone.due_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection
              entityType="milestone"
              entityId={milestone.id}
              entityTitle={milestone.title}
            />
          </div>
        ))}

        {milestones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay hitos definidos. Crea el primer hito del proyecto.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingMilestone ? 'Editar Hito' : 'Nuevo Hito'}
            </h3>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="planning">Planificación</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progreso: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${formData.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingMilestone(null)
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
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

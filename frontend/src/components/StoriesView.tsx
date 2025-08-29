import { useState, useEffect } from 'react'
import { BookOpen, Plus, Users, Calendar, Target, CheckCircle, Clock, Edit, Trash2, ArrowRight, X, Save } from 'lucide-react'
import apiService from '../services/api.js'

const StoriesView = () => {
  const [stories, setStories] = useState<any[]>([])
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [storyTasks, setStoryTasks] = useState<any[]>([])
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [editingStory, setEditingStory] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [storyForm, setStoryForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    region: 'TODAS',
    assignee_id: '',
    start_date: '',
    target_date: ''
  })

  useEffect(() => {
    loadStories()
    loadUsers()
  }, [])

  const loadStories = async () => {
    try {
      const storiesData = await apiService.request('/stories')
      setStories(storiesData)
    } catch (error) {
      console.error('Error loading stories:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const usersData = await apiService.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadStoryTasks = async (storyId: string) => {
    try {
      const tasks = await apiService.request(`/stories/${storyId}/tasks`)
      setStoryTasks(tasks)
    } catch (error) {
      console.error('Error loading story tasks:', error)
    }
  }

  const handleStoryClick = (story: any) => {
    setSelectedStory(story)
    loadStoryTasks(story.id)
  }

  const handleCreateStory = () => {
    setEditingStory(null)
    setShowStoryModal(true)
    setStoryForm({
      title: '',
      description: '',
      priority: 'medium',
      region: 'TODAS',
      assignee_id: users.length > 0 ? users[0].id.toString() : '',
      start_date: '',
      target_date: ''
    })
  }

  const handleEditStory = (story: any) => {
    setEditingStory(story)
    setShowStoryModal(true)
    setStoryForm({
      title: story.title,
      description: story.description || '',
      priority: story.priority,
      region: story.region || 'TODAS',
      assignee_id: story.assignee_id?.toString() || '',
      start_date: story.start_date || '',
      target_date: story.target_date || ''
    })
  }

  const handleSaveStory = async () => {
    if (!storyForm.title.trim()) return

    try {
      if (editingStory) {
        await apiService.request(`/stories/${editingStory.id}`, {
          method: 'PUT',
          body: JSON.stringify(storyForm)
        })
      } else {
        await apiService.request('/stories', {
          method: 'POST',
          body: JSON.stringify(storyForm)
        })
      }
      
      await loadStories()
      setShowStoryModal(false)
      setEditingStory(null)
    } catch (error) {
      console.error('Error saving story:', error)
    }
  }

  const handleCompleteStory = async (story: any) => {
    if (confirm(`¿Completar la historia "${story.title}" y crear un hito?`)) {
      try {
        await apiService.request(`/stories/${story.id}/complete`, {
          method: 'POST'
        })
        await loadStories()
        if (selectedStory?.id === story.id) {
          setSelectedStory(null)
        }
      } catch (error) {
        console.error('Error completing story:', error)
      }
    }
  }

  const handleDeleteStory = async (story: any) => {
    if (confirm(`¿Eliminar la historia "${story.title}"? Las tareas se desvincularan pero no se eliminaran.`)) {
      try {
        await apiService.request(`/stories/${story.id}`, {
          method: 'DELETE'
        })
        await loadStories()
        if (selectedStory?.id === story.id) {
          setSelectedStory(null)
        }
      } catch (error) {
        console.error('Error deleting story:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-600" />
            Historias del Proyecto EMx
          </h1>
          <p className="text-gray-600 mt-1">
            Agrupa tareas en historias que se convierten en hitos al completarse
          </p>
        </div>
        <button
          onClick={handleCreateStory}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Nueva Historia
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Historias */}
        <div className="lg:col-span-2 space-y-4">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className={`card cursor-pointer transition-all hover:shadow-md ${
                selectedStory?.id === story.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{story.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                      {story.status === 'completed' ? 'Completada' : 
                       story.status === 'in-progress' ? 'En Progreso' : 'Activa'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{story.description}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditStory(story)
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteStory(story)
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{story.assignee_name || 'Sin asignar'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{story.target_date ? new Date(story.target_date).toLocaleDateString() : 'Sin fecha'}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getPriorityColor(story.priority)}`}>
                    <span>●</span>
                    <span className="capitalize">{story.priority}</span>
                  </div>
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {story.region}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {story.completed_tasks || 0}/{story.task_count || 0} tareas
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${story.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{story.progress || 0}%</span>
                  </div>
                </div>
                
                {story.status !== 'completed' && story.progress >= 80 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCompleteStory(story)
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded transition-colors"
                  >
                    <CheckCircle size={12} />
                    Completar → Hito
                  </button>
                )}
              </div>
            </div>
          ))}

          {stories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No hay historias creadas aún</p>
              <p className="text-sm">Crea tu primera historia para agrupar tareas</p>
            </div>
          )}
        </div>

        {/* Detalles de Historia Seleccionada */}
        <div className="space-y-4">
          {selectedStory ? (
            <>
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-600" />
                  {selectedStory.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{selectedStory.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedStory.status)}`}>
                      {selectedStory.status === 'completed' ? 'Completada' : 
                       selectedStory.status === 'in-progress' ? 'En Progreso' : 'Activa'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Responsable:</span>
                    <span>{selectedStory.assignee_name || 'Sin asignar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha objetivo:</span>
                    <span>{selectedStory.target_date ? new Date(selectedStory.target_date).toLocaleDateString() : 'Sin fecha'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progreso:</span>
                    <span>{selectedStory.progress || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tareas ({storyTasks.length})
                </h4>
                <div className="space-y-2">
                  {storyTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500' : 
                        task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="flex-1">{task.title}</span>
                      <span className="text-xs text-gray-500">{task.progress || 0}%</span>
                    </div>
                  ))}
                  {storyTasks.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No hay tareas asignadas a esta historia
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card text-center py-8 text-gray-500">
              <ArrowRight size={24} className="mx-auto mb-2 text-gray-300" />
              <p>Selecciona una historia para ver sus detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar historia */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen size={20} className="text-primary-600" />
                {editingStory ? 'Editar Historia' : 'Nueva Historia'}
              </h3>
              <button onClick={() => setShowStoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la Historia
                </label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({...storyForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Migración de Clientes Fase 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={storyForm.description}
                  onChange={(e) => setStoryForm({...storyForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Descripción de la historia..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsable Principal
                </label>
                <select
                  value={storyForm.assignee_id}
                  onChange={(e) => setStoryForm({...storyForm, assignee_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={storyForm.priority}
                    onChange={(e) => setStoryForm({...storyForm, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Región
                  </label>
                  <select
                    value={storyForm.region}
                    onChange={(e) => setStoryForm({...storyForm, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="TODAS">🌍 TODAS</option>
                    <option value="CECA">CECA</option>
                    <option value="SOLA">SOLA</option>
                    <option value="MX">MX</option>
                    <option value="SNAP">SNAP</option>
                    <option value="COEC">COEC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={storyForm.start_date}
                    onChange={(e) => setStoryForm({...storyForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Objetivo
                  </label>
                  <input
                    type="date"
                    value={storyForm.target_date}
                    onChange={(e) => setStoryForm({...storyForm, target_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowStoryModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveStory}
                  disabled={!storyForm.title.trim()}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {editingStory ? 'Actualizar' : 'Crear'} Historia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoriesView

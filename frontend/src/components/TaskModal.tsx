import { useState, useEffect } from 'react'
import { X, Save, BookOpen } from 'lucide-react'
import apiService from '../services/api.js'
import { useStore } from '../store/useStore'

interface Task {
  id: string
  title: string
  description: string
  status: 'planning' | 'in-progress' | 'completed' | 'review'
  assignee: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  region?: string
  story_id?: string
}

interface TaskModalProps {
  task?: Task
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
}

const TaskModal = ({ task, isOpen, onClose, onSave }: TaskModalProps) => {
  const { users, loadUsers } = useStore()
  const [stories, setStories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'planning',
    assignee_id: task?.assignee_id || '',
    due_date: task?.due_date || '',
    priority: task?.priority || 'medium',
    region: task?.region || 'TODAS',
    story_id: task?.story_id || '',
    progress: task?.progress || 0
  })

  // Actualizar formData cuando cambie la tarea
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'planning',
        assignee_id: task.assignee_id || '',
        due_date: task.due_date || '',
        priority: task.priority || 'medium',
        region: task.region || 'TODAS',
        story_id: task.story_id?.toString() || '',
        progress: task.progress || 0
      })
    }
  }, [task])

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      // Load users from store
      await loadUsers()
      
      // Load stories
      const storiesData = await apiService.request('/stories')
      const activeStories = storiesData.filter((story: any) => story.status !== 'completed')
      setStories(activeStories)
      
      // Set defaults if none selected
      if (!formData.assignee_id && users.length > 0) {
        setFormData(prev => ({ ...prev, assignee_id: users[0].id.toString() }))
      }
      if (!formData.story_id && activeStories.length > 0) {
        setFormData(prev => ({ ...prev, story_id: activeStories[0].id.toString() }))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.story_id) {
      alert('Debes seleccionar una historia para la tarea')
      return
    }

    const newTask: Task = {
      id: task?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      assignee_id: formData.assignee_id,
      due_date: formData.due_date,
      priority: formData.priority,
      region: formData.region,
      story_id: formData.story_id,
      progress: formData.progress
    }
    onSave(newTask)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Historia - Campo Obligatorio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <BookOpen size={14} className="text-primary-600" />
              Historia <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.story_id}
              onChange={(e) => setFormData({...formData, story_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Seleccionar historia...</option>
              {stories.map(story => (
                <option key={story.id} value={story.id}>
                  📚 {story.title} ({story.status === 'in-progress' ? 'En Progreso' : 'Activa'})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Cada tarea debe pertenecer a una historia
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
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
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="planning">Planificación</option>
                <option value="in-progress">En Progreso</option>
                <option value="review">En Revisión</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              value={formData.assignee_id}
              onChange={(e) => setFormData({...formData, assignee_id: e.target.value})}
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
                Fecha Límite
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progreso: {formData.progress}%
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${formData.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal

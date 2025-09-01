import { useState, useEffect } from 'react'
import { Plus, User, Calendar, Edit, BookOpen, Trash2, MessageCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/authStore'
import TaskModal from './TaskModal'
import AdvancedFilters from './AdvancedFilters'
import ProtectedAction from './ProtectedAction'

const TaskBoard = () => {
  const { tasks, loadTasks, updateTask, addTask, deleteTask } = useStore()
  const { canEdit, user: authUser } = useAuthStore()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const statusConfig = {
    planning: { label: 'Planificación', color: 'bg-gray-100 text-gray-800' },
    'in-progress': { label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completada', color: 'bg-green-100 text-green-800' },
    blocked: { label: 'Bloqueada', color: 'bg-red-100 text-red-800' }
  }

  const priorityConfig = {
    low: { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
    medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    high: { label: 'Alta', color: 'bg-red-100 text-red-800' }
  }

  const filteredTasks = tasks.filter(task => {
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false
    
    // Aplicar filtros avanzados
    if (filters.region && filters.region !== 'all' && task.region !== filters.region) return false
    if (filters.assignee && task.assignee_id !== parseInt(filters.assignee)) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    
    return true
  })

  const handleEdit = (task) => {
    if (!canEdit()) return
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDelete = async (taskId) => {
    if (!canEdit()) return
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await deleteTask(taskId)
    }
  }

  const handleProgressChange = async (taskId, newProgress) => {
    if (!canEdit()) return
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      await updateTask(taskId, { ...task, progress: newProgress })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Tareas</h2>
          <p className="text-gray-600">
            {authUser?.role === 'viewer' 
              ? 'Vista de solo lectura - Puedes ver todas las tareas y agregar comentarios'
              : 'Administra y da seguimiento a las tareas del proyecto'
            }
          </p>
        </div>
        
        <ProtectedAction requireEdit>
          <button
            onClick={() => {
              setEditingTask(null)
              setIsModalOpen(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </ProtectedAction>
      </div>

      {/* Filters */}
      <AdvancedFilters onFiltersChange={setFilters} />

      {/* Status Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas ({tasks.length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = tasks.filter(task => task.status === status).length
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {config.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            {/* Task Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
              </div>
              
              <ProtectedAction requireEdit>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </ProtectedAction>
            </div>

            {/* Task Details */}
            <div className="space-y-3">
              {/* Status and Priority */}
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[task.status]?.color}`}>
                  {statusConfig[task.status]?.label}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[task.priority]?.color}`}>
                  {priorityConfig[task.priority]?.label}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progreso</span>
                  <span className="font-medium">{task.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
                
                <ProtectedAction requireEdit>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress || 0}
                    onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </ProtectedAction>
              </div>

              {/* Assignee and Date */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{task.assignee_name || 'Sin asignar'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}</span>
                </div>
              </div>

              {/* Story Link */}
              {task.story_title && (
                <div className="flex items-center space-x-1 text-sm text-blue-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{task.story_title}</span>
                </div>
              )}

              {/* Comments Button */}
              <div className="pt-2 border-t">
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comentarios</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
          <p className="text-gray-600 mb-4">
            {selectedStatus === 'all' 
              ? 'No se encontraron tareas con los filtros aplicados'
              : `No hay tareas en estado "${statusConfig[selectedStatus]?.label}"`
            }
          </p>
          <ProtectedAction requireEdit>
            <button
              onClick={() => {
                setEditingTask(null)
                setIsModalOpen(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Crear primera tarea
            </button>
          </ProtectedAction>
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTask(null)
          }}
          onSave={async (taskData) => {
            if (editingTask) {
              await updateTask(editingTask.id, taskData)
            } else {
              await addTask(taskData)
            }
            setIsModalOpen(false)
            setEditingTask(null)
          }}
        />
      )}
    </div>
  )
}

export default TaskBoard

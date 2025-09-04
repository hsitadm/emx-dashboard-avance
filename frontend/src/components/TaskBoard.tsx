import { useState, useEffect } from 'react'
import { Plus, MessageCircle, User, Calendar, ArrowRight, ArrowLeft, Edit, Trash2, BookOpen } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/authStore'
import TaskComments from './TaskComments'
import TaskModal from './TaskModal'
import apiService from '../services/api.js'

const TaskBoard = () => {
  const { tasks, loadTasks, updateTask, addTask } = useStore()
const { canEdit } = useAuthStore()
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const columns = [
    { id: 'planning' as const, title: 'Planificación', color: 'bg-gray-100' },
    { id: 'in-progress' as const, title: 'En Progreso', color: 'bg-blue-100' },
    { id: 'review' as const, title: 'En Revisión', color: 'bg-yellow-100' },
    { id: 'completed' as const, title: 'Completado', color: 'bg-green-100' }
  ]

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500'
  }

  const moveTask = async (taskId: string, newStatus: 'planning' | 'in-progress' | 'review' | 'completed') => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return

    await updateTask(taskId, { ...task, status: newStatus })
  }

  const handleEditTask = (task: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (task: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
      try {
        await apiService.request(`/tasks/${task.id}`, { method: 'DELETE' })
        await loadTasks() // Recargar tareas
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleSaveTask = async (taskData: any) => {
    if (editingTask) {
      // Editar tarea existente
      await updateTask(editingTask.id, {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        assignee_id: parseInt(taskData.assignee),
        due_date: taskData.dueDate,
        priority: taskData.priority,
        region: taskData.region,
        story_id: taskData.story_id
      })
    } else {
      // Crear nueva tarea
      await addTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || 'planning',
        assignee_id: parseInt(taskData.assignee),
        due_date: taskData.dueDate,
        priority: taskData.priority,
        region: taskData.region,
        story_id: taskData.story_id,
        progress: 0
      })
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = columns.findIndex(c => c.id === currentStatus)
    return currentIndex < columns.length - 1 ? columns[currentIndex + 1].id : null
  }

  const getPrevStatus = (currentStatus: string) => {
    const currentIndex = columns.findIndex(c => c.id === currentStatus)
    return currentIndex > 0 ? columns[currentIndex - 1].id : null
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Tareas EMx</h2>
        <button 
          onClick={handleNewTask}
          className="btn-primary flex items-center gap-2" disabled={!canEdit()}
        >
          <Plus size={16} />
          Nueva Tarea
        </button>
      </div>

      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          🎯 <strong>CRUD Completo:</strong> Crea, edita y elimina tareas. Usa ← → para mover entre estados. 
          Haz clic en 💬 para comentarios. ✏️ para editar, 🗑️ para eliminar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-lg p-4 min-h-[500px]`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${priorityColors[task.priority]} hover:shadow-md transition-shadow group`}
                >
                  {/* Header con título y acciones */}
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleEditTask(task, e)}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Editar tarea"
                      >
                        <Edit size={12} className="text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTask(task, e)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Eliminar tarea"
                      >
                        <Trash2 size={12} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Historia asociada */}
                  {task.story_title && (
                    <div className="flex items-center gap-1 mb-2 px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                      <BookOpen size={10} />
                      <span className="truncate">{task.story_title}</span>
                    </div>
                  )}

                  {/* Progress bar */}
                  {task.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{task.assignee_name || 'Sin asignar'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {task.region}
                    </span>
                    <button
                      onClick={() => setCommentsOpen(task.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <MessageCircle size={12} />
                      <span>0</span>
                    </button>
                  </div>

                  {/* Botones de movimiento */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        const prevStatus = getPrevStatus(task.status)
                        if (prevStatus) moveTask(task.id, prevStatus)
                      }}
                      disabled={!getPrevStatus(task.status)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft size={12} />
                      Atrás
                    </button>

                    <button
                      onClick={() => {
                        const nextStatus = getNextStatus(task.status)
                        if (nextStatus) moveTask(task.id, nextStatus)
                      }}
                      disabled={!getNextStatus(task.status)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No hay tareas en {column.title.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskComments
        taskId={commentsOpen || ''}
        isOpen={!!commentsOpen}
        onClose={() => setCommentsOpen(null)}
      />

      <TaskModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  )
}

export default TaskBoard

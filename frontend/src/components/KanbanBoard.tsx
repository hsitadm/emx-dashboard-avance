import { useState, useEffect } from 'react'
import { Plus, MessageCircle, User, Calendar, ArrowRight, ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import TaskComments from './TaskComments'
import TaskModal from './TaskModal'

const KanbanBoard = () => {
  const { tasks, loadTasks, updateTask, addTask } = useStore()
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    
    const columnName = columns.find(c => c.id === newStatus)?.title
    console.log(`Tarea "${task.title}" movida a "${columnName}"`)
  }

  const handleSaveTask = async (taskData: any) => {
    await addTask({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'planning',
      assignee_id: taskData.assignee_id,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      region: taskData.region,
      progress: 0
    })
    setIsModalOpen(false)
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
        <h2 className="text-xl font-semibold text-gray-900">Tablero Kanban EMx</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Nueva Tarea
        </button>
      </div>

      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          ✨ <strong>Datos Reales EMx:</strong> Usa las flechas ← → para mover tareas entre estados. 
          Haz clic en 💬 para comentarios. Total: {tasks.length} tareas del proyecto.
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
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${priorityColors[task.priority]} hover:shadow-md transition-shadow`}
                >
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>

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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  )
}

export default KanbanBoard

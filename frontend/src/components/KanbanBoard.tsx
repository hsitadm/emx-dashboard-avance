import { useState } from 'react'
import { Plus, MessageCircle, User, Calendar } from 'lucide-react'
import { useStore } from '../store/useStore'
import TaskComments from './TaskComments'

const KanbanBoard = () => {
  const { tasks, updateTask } = useStore()
  const [draggedTask, setDraggedTask] = useState<any>(null)
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null)

  // Datos de ejemplo si no hay tareas
  const sampleTasks = [
    {
      id: '1',
      title: 'Migración Clientes Corporativos',
      description: 'Migrar 50 clientes corporativos al nuevo sistema EMx',
      status: 'in-progress',
      assignee: 'María González',
      dueDate: '2025-02-15',
      priority: 'high',
      region: 'CECA',
      comments: 3
    },
    {
      id: '2',
      title: 'Configuración Equipos Regionales',
      description: 'Establecer equipos de trabajo por región',
      status: 'completed',
      assignee: 'Carlos Ruiz',
      dueDate: '2025-01-30',
      priority: 'medium',
      region: 'SOLA',
      comments: 1
    },
    {
      id: '3',
      title: 'Definición Procesos EMx',
      description: 'Documentar nuevos procesos operativos',
      status: 'planning',
      assignee: 'Ana López',
      dueDate: '2025-03-01',
      priority: 'high',
      region: 'MX',
      comments: 0
    },
    {
      id: '4',
      title: 'Capacitación Champions',
      description: 'Entrenar a EMx Champions en nuevas herramientas',
      status: 'review',
      assignee: 'Pedro Martín',
      dueDate: '2025-02-20',
      priority: 'medium',
      region: 'SNAP',
      comments: 2
    }
  ]

  const allTasks = tasks.length > 0 ? tasks : sampleTasks

  const columns = [
    { id: 'planning', title: 'Planificación', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'En Progreso', color: 'bg-blue-100' },
    { id: 'review', title: 'En Revisión', color: 'bg-yellow-100' },
    { id: 'completed', title: 'Completado', color: 'bg-green-100' }
  ]

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500'
  }

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { ...draggedTask, status: newStatus })
    }
    setDraggedTask(null)
  }

  const getTasksByStatus = (status: string) => {
    return allTasks.filter(task => task.status === status)
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tablero Kanban</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nueva Tarea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-lg p-4 min-h-[500px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
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
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${priorityColors[task.priority as keyof typeof priorityColors]} cursor-move hover:shadow-md transition-shadow`}
                >
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">
                    {task.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {task.region}
                    </span>
                    <button
                      onClick={() => setCommentsOpen(task.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                    >
                      <MessageCircle size={12} />
                      {task.comments || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <TaskComments
        taskId={commentsOpen || ''}
        isOpen={!!commentsOpen}
        onClose={() => setCommentsOpen(null)}
      />
    </div>
  )
}

export default KanbanBoard

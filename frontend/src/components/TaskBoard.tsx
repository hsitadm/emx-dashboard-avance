import { useState, useEffect } from 'react'
import { Plus, User, Calendar, Edit } from 'lucide-react'
import { useStore } from '../store/useStore'
import TaskModal from './TaskModal'
import AdvancedFilters from './AdvancedFilters'

const TaskBoard = () => {
  const { tasks, loadTasks, updateTask } = useStore()
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
    review: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completado', color: 'bg-green-100 text-green-800' }
  }

  const priorityConfig = {
    low: { color: 'text-green-600', icon: '●' },
    medium: { color: 'text-yellow-600', icon: '●' },
    high: { color: 'text-red-600', icon: '●' }
  }

  const applyFilters = (taskList: any[]) => {
    return taskList.filter(task => {
      if (filters.region && filters.region !== 'TODAS' && task.region !== filters.region && task.region !== 'TODAS') return false
      if (filters.assignee && task.assignee_name !== filters.assignee) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.status && task.status !== filters.status) return false
      if (filters.dateFrom && task.due_date < filters.dateFrom) return false
      if (filters.dateTo && task.due_date > filters.dateTo) return false
      return true
    })
  }

  const filteredTasks = applyFilters(
    selectedStatus === 'all' ? tasks : tasks.filter(task => task.status === selectedStatus)
  )

  const getStatusCount = (status: string) => {
    return applyFilters(tasks.filter(task => task.status === status)).length
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (taskData: any) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    }
    setEditingTask(null)
    setIsModalOpen(false)
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Tareas EMx</h2>
        <div className="flex gap-3">
          <AdvancedFilters onFiltersChange={setFilters} />
          <button onClick={handleNewTask} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Nueva Tarea
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
            selectedStatus === 'all' 
              ? 'bg-primary-100 text-primary-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todas ({applyFilters(tasks).length})
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedStatus === status 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {config.label} ({getStatusCount(status)})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                
                {/* Progress bar */}
                {task.progress !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[task.status as keyof typeof statusConfig].color}`}>
                  {statusConfig[task.status as keyof typeof statusConfig].label}
                </span>
                <button
                  onClick={() => handleEditTask(task)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{task.assignee_name || 'Sin asignar'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={priorityConfig[task.priority as keyof typeof priorityConfig].color}>
                    {priorityConfig[task.priority as keyof typeof priorityConfig].icon}
                  </span>
                  <span className="capitalize">{task.priority}</span>
                </div>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                {task.region}
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {tasks.length === 0 ? 'Cargando tareas...' : 'No se encontraron tareas con los filtros aplicados'}
          </div>
        )}
      </div>

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

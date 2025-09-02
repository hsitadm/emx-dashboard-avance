import { useState, useEffect } from "react"
import { Plus, Edit } from "lucide-react"
import { useStore } from "../store/useStore"
import TaskModal from "./TaskModal"
import AdvancedFilters from "./AdvancedFilters"

const KanbanBoard = () => {
  const { tasks, loadTasks, updateTask, addTask } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const columns = [
    { id: "planning", title: "Planificación", color: "bg-gray-100" },
    { id: "in-progress", title: "En Progreso", color: "bg-blue-100" },
    { id: "review", title: "En Revisión", color: "bg-yellow-100" },
    { id: "completed", title: "Completado", color: "bg-green-100" }
  ]

  const handleNewTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (filters.region && filters.region !== "all" && task.region !== filters.region) return false
      if (filters.assignee && filters.assignee !== "all" && task.assignee_id !== parseInt(filters.assignee)) return false
      if (filters.priority && filters.priority !== "all" && task.priority !== filters.priority) return false
      return true
    })
  }

  const getTasksByStatus = (status) => {
    return getFilteredTasks().filter(task => task.status === status)
  }

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData)
    } else {
      await addTask(taskData)
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📋 Tablero Kanban EMx</h2>
          <p className="text-sm text-gray-600 mt-1">Gestiona tareas por estado con filtros avanzados</p>
        </div>
        <button onClick={handleNewTask} className="btn-primary flex items-center gap-2 px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
          <Plus size={18} />
          Nueva Tarea
        </button>
      </div>

      <div className="mb-6">
        <AdvancedFilters onFiltersChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`${column.color} rounded-xl p-4 shadow-sm border border-gray-200`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">{column.title}</h3>
              <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm border">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            <div className="space-y-3 min-h-[200px]">
              {getTasksByStatus(column.id).map((task) => (
                <div key={task.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h4>
                    <button 
                      onClick={() => { setEditingTask(task); setIsModalOpen(true) }} 
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded-md transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  
                  <div className="flex justify-between items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200">
                      🌍 {task.region}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)} {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  
                  {task.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="text-sm">No hay tareas</p>
                </div>
              )}
            </div>
          </div>
        ))}
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

export default KanbanBoard

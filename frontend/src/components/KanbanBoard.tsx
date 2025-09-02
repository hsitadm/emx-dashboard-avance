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

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tablero Kanban EMx</h2>
        <button onClick={handleNewTask} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nueva Tarea
        </button>
      </div>

      <AdvancedFilters onFiltersChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-xs font-medium">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                    <button onClick={() => { setEditingTask(task); setIsModalOpen(true) }} className="text-blue-600">
                      <Edit size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">{task.region}</span>
                    <span className="bg-blue-100 px-2 py-1 rounded">{task.priority}</span>
                  </div>
                </div>
              ))}
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

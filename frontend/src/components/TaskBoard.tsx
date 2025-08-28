import { useState } from 'react'
import { Plus, User, Calendar, AlertCircle } from 'lucide-react'

const TaskBoard = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const tasks = [
    {
      id: '1',
      title: 'Migración Clientes Corporativos',
      description: 'Migrar 50 clientes corporativos al nuevo sistema EMx',
      status: 'in-progress',
      assignee: 'María González',
      dueDate: '2025-02-15',
      priority: 'high',
      region: 'Norte'
    },
    {
      id: '2',
      title: 'Configuración Equipos Regionales',
      description: 'Establecer equipos de trabajo por región',
      status: 'completed',
      assignee: 'Carlos Ruiz',
      dueDate: '2025-01-30',
      priority: 'medium',
      region: 'Centro'
    },
    {
      id: '3',
      title: 'Definición Procesos EMx',
      description: 'Documentar nuevos procesos operativos',
      status: 'planning',
      assignee: 'Ana López',
      dueDate: '2025-03-01',
      priority: 'high',
      region: 'Sur'
    },
    {
      id: '4',
      title: 'Capacitación Champions',
      description: 'Entrenar a EMx Champions en nuevas herramientas',
      status: 'review',
      assignee: 'Pedro Martín',
      dueDate: '2025-02-20',
      priority: 'medium',
      region: 'Occidente'
    }
  ]

  const statusConfig = {
    planning: { label: 'Planificación', color: 'bg-gray-100 text-gray-800', count: 1 },
    'in-progress': { label: 'En Progreso', color: 'bg-blue-100 text-blue-800', count: 1 },
    review: { label: 'En Revisión', color: 'bg-yellow-100 text-yellow-800', count: 1 },
    completed: { label: 'Completado', color: 'bg-green-100 text-green-800', count: 1 }
  }

  const priorityConfig = {
    low: { color: 'text-green-600', icon: '●' },
    medium: { color: 'text-yellow-600', icon: '●' },
    high: { color: 'text-red-600', icon: '●' }
  }

  const filteredTasks = selectedStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === selectedStatus)

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Gestión de Tareas</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nueva Tarea
        </button>
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
          Todas ({tasks.length})
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
            {config.label} ({config.count})
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
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[task.status as keyof typeof statusConfig].color}`}>
                {statusConfig[task.status as keyof typeof statusConfig].label}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{task.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
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
      </div>
    </div>
  )
}

export default TaskBoard

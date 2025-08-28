import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus, X, Save, User } from 'lucide-react'
import { useStore } from '../store/useStore'
import apiService from '../services/api.js'

const CalendarView = () => {
  const { tasks, loadTasks, addTask } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    region: 'TODAS',
    assignee_id: ''
  })

  useEffect(() => {
    loadTasks()
    loadUsers()
  }, [loadTasks])

  const loadUsers = async () => {
    try {
      const usersData = await apiService.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const milestones = [
    { id: '1', title: 'Kick-off del Proyecto', date: '2025-01-15', completed: true },
    { id: '2', title: 'Análisis y Planificación', date: '2025-01-30', completed: true },
    { id: '3', title: 'Configuración Inicial', date: '2025-02-15', completed: false },
    { id: '4', title: 'Migración Fase 1', date: '2025-03-01', completed: false },
    { id: '5', title: 'Go-Live EMx', date: '2025-04-01', completed: false }
  ]

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }
    
    // Días del siguiente mes para completar la grilla
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }
    
    return days
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.filter(task => task.due_date === dateStr)
  }

  const getMilestonesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return milestones.filter(milestone => milestone.date === dateStr)
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    
    const allEvents = [
      ...tasks.map(task => ({
        ...task,
        dueDate: task.due_date,
        assignee_name: task.assignee_name || 'Sin asignar'
      })),
      ...milestones.map(m => ({
        ...m,
        dueDate: m.date,
        assignee_name: 'Sistema',
        due_date: m.date
      }))
    ]

    return allEvents
      .filter(item => {
        const eventDate = new Date(item.due_date || item.dueDate)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })
      .sort((a, b) => new Date(a.due_date || a.dueDate).getTime() - new Date(b.due_date || b.dueDate).getTime())
      .slice(0, 5)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDayClick = (date: Date) => {
    if (!date) return
    setSelectedDate(date)
    setShowEventModal(true)
    setEventForm({
      title: '',
      description: '',
      priority: 'medium',
      region: 'TODAS',
      assignee_id: users.length > 0 ? users[0].id.toString() : '8' // Default to first user or Usuario Demo
    })
  }

  const handleSaveEvent = async () => {
    if (!selectedDate || !eventForm.title.trim()) return

    const taskData = {
      title: eventForm.title,
      description: eventForm.description,
      status: 'planning' as const,
      assignee_id: parseInt(eventForm.assignee_id) || 8,
      due_date: selectedDate.toISOString().split('T')[0],
      priority: eventForm.priority as 'low' | 'medium' | 'high',
      region: eventForm.region,
      progress: 0
    }

    await addTask(taskData)
    setShowEventModal(false)
    setSelectedDate(null)
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Calendario del Proyecto EMx</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                view === 'month' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                view === 'week' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              Semana
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-lg min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          📅 <strong>Cómo usar:</strong> Haz clic en cualquier día para crear un nuevo evento/tarea con responsable asignado. 
          Los puntos de colores indican prioridad: 🔴 Alta, 🟡 Media, 🟢 Baja.
        </p>
      </div>

      {view === 'month' && (
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
              {day}
            </div>
          ))}
          
          {getDaysInMonth(currentDate).map((day, index) => {
            const dayTasks = getTasksForDate(day.date)
            const dayMilestones = getMilestonesForDate(day.date)
            
            return (
              <div
                key={index}
                onClick={() => day.isCurrentMonth && handleDayClick(day.date)}
                className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayMilestones.map(milestone => (
                    <div
                      key={milestone.id}
                      className={`text-xs p-1 rounded ${
                        milestone.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      🎯 {milestone.title}
                    </div>
                  ))}
                  
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className="text-xs p-1 bg-gray-100 rounded flex items-center gap-1"
                    >
                      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></div>
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal para crear evento */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Nuevo Evento - {selectedDate?.toLocaleDateString()}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Evento
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Reunión de seguimiento EMx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Descripción del evento..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <User size={14} />
                  Responsable
                </label>
                <select
                  value={eventForm.assignee_id}
                  onChange={(e) => setEventForm({...eventForm, assignee_id: e.target.value})}
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
                    value={eventForm.priority}
                    onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
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
                    value={eventForm.region}
                    onChange={(e) => setEventForm({...eventForm, region: e.target.value})}
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
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEvent}
                  disabled={!eventForm.title.trim()}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  Crear Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Próximos Eventos</h3>
        <div className="space-y-2">
          {getUpcomingEvents().map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <Calendar size={16} className="text-gray-400" />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{new Date(item.due_date || item.dueDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.assignee_name}</span>
                </div>
              </div>
            </div>
          ))}
          {getUpcomingEvents().length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No hay eventos próximos programados
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView

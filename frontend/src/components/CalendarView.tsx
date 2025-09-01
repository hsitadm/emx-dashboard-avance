import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Plus, X, Save, User, Edit, Trash2, Target } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/authStore'
import apiService from '../services/api.js'
import ProtectedAction from './ProtectedAction'

const CalendarView = () => {
  const { tasks, loadTasks, addTask, updateTask } = useStore()
  const { canEdit } = useAuthStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [showEventModal, setShowEventModal] = useState(false)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    region: 'TODAS',
    assignee_id: ''
  })
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    progress: 0
  })

  useEffect(() => {
    loadTasks()
    loadUsers()
    loadMilestones()
  }, [loadTasks])

  const loadUsers = async () => {
    try {
      const usersData = await apiService.getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadMilestones = async () => {
    try {
      const milestonesData = await apiService.getMilestones()
      setMilestones(milestonesData)
    } catch (error) {
      console.error('Error loading milestones:', error)
    }
  }

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
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }
    
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
    return milestones.filter(milestone => milestone.due_date === dateStr)
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const allEvents = [
      ...tasks.map(task => ({
        ...task,
        dueDate: task.due_date,
        assignee_name: task.assignee_name || 'Sin asignar',
        type: 'task'
      })),
      ...milestones.map(m => ({
        ...m,
        dueDate: m.due_date,
        assignee_name: 'Sistema',
        due_date: m.due_date,
        type: 'milestone'
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
    setEditingEvent(null)
    setShowEventModal(true)
    setEventForm({
      title: '',
      description: '',
      priority: 'medium',
      region: 'TODAS',
      assignee_id: users.length > 0 ? users[0].id.toString() : '8'
    })
  }

  const handleDayRightClick = (date: Date, e: React.MouseEvent) => {
    e.preventDefault()
    if (!date) return
    setSelectedDate(date)
    setEditingMilestone(null)
    setShowMilestoneModal(true)
    setMilestoneForm({
      title: '',
      description: '',
      status: 'pending',
      progress: 0
    })
  }

  const handleEditEvent = (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit()) return
    
    setEditingEvent(event)
    setSelectedDate(new Date(event.due_date))
    setShowEventModal(true)
    setEventForm({
      title: event.title,
      description: event.description || '',
      priority: event.priority,
      region: event.region || 'TODAS',
      assignee_id: event.assignee_id?.toString() || '8'
    })
  }

  const handleEditMilestone = (milestone: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit()) return
    
    setEditingMilestone(milestone)
    setSelectedDate(new Date(milestone.due_date))
    setShowMilestoneModal(true)
    setMilestoneForm({
      title: milestone.title,
      description: milestone.description || '',
      status: milestone.status,
      progress: milestone.progress || 0
    })
  }

  const handleDeleteEvent = async (event: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit()) return
    
    if (confirm(`¿Estás seguro de eliminar "${event.title}"?`)) {
      try {
        await apiService.request(`/tasks/${event.id}`, { method: 'DELETE' })
        await loadTasks()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
  }

  const handleDeleteMilestone = async (milestone: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!canEdit()) return
    
    if (confirm(`¿Estás seguro de eliminar el hito "${milestone.title}"?`)) {
      try {
        await apiService.deleteMilestone(milestone.id)
        await loadMilestones()
      } catch (error) {
        console.error('Error deleting milestone:', error)
      }
    }
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

    if (editingEvent) {
      await updateTask(editingEvent.id, taskData)
    } else {
      await addTask(taskData)
    }
    
    setShowEventModal(false)
    setSelectedDate(null)
    setEditingEvent(null)
  }

  const handleSaveMilestone = async () => {
    if (!selectedDate || !milestoneForm.title.trim()) return

    const milestoneData = {
      title: milestoneForm.title,
      description: milestoneForm.description,
      due_date: selectedDate.toISOString().split('T')[0],
      status: milestoneForm.status,
      progress: milestoneForm.progress
    }

    try {
      if (editingMilestone) {
        await apiService.updateMilestone(editingMilestone.id, milestoneData)
      } else {
        await apiService.createMilestone(milestoneData)
      }
      await loadMilestones()
    } catch (error) {
      console.error('Error saving milestone:', error)
    }
    
    setShowMilestoneModal(false)
    setSelectedDate(null)
    setEditingMilestone(null)
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
          📅 <strong>CRUD Completo:</strong> Clic izquierdo = crear/editar eventos. 
          Clic derecho = crear hitos 🎯. Usa ✏️ para editar y 🗑️ para eliminar.
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
                onContextMenu={(e) => day.isCurrentMonth && handleDayRightClick(day.date, e)}
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
                      className={`text-xs p-1 rounded flex items-center justify-between group hover:bg-blue-200 ${
                        milestone.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <Target size={10} />
                        <span className="truncate">{milestone.title}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ProtectedAction requiredPermission="edit">
                          <button
                            onClick={(e) => handleEditMilestone(milestone, e)}
                            className="p-0.5 hover:bg-blue-300 rounded"
                            title="Editar hito"
                          >
                            <Edit size={8} className="text-blue-700" />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction requiredPermission="edit">
                          <button
                            onClick={(e) => handleDeleteMilestone(milestone, e)}
                            className="p-0.5 hover:bg-red-200 rounded"
                            title="Eliminar hito"
                          >
                            <Trash2 size={8} className="text-red-600" />
                          </button>
                        </ProtectedAction>
                      </div>
                    </div>
                  ))}
                  
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className="text-xs p-1 bg-gray-100 rounded flex items-center justify-between group hover:bg-gray-200"
                    >
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`}></div>
                        <span className="truncate">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ProtectedAction requiredPermission="edit">
                          <button
                            onClick={(e) => handleEditEvent(task, e)}
                            className="p-0.5 hover:bg-blue-200 rounded"
                            title="Editar evento"
                          >
                            <Edit size={10} className="text-blue-600" />
                          </button>
                        </ProtectedAction>
                        <ProtectedAction requiredPermission="edit">
                          <button
                            onClick={(e) => handleDeleteEvent(task, e)}
                            className="p-0.5 hover:bg-red-200 rounded"
                            title="Eliminar evento"
                          >
                            <Trash2 size={10} className="text-red-600" />
                          </button>
                        </ProtectedAction>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal para crear/editar evento */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'} - {selectedDate?.toLocaleDateString()}
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
                  {editingEvent ? 'Actualizar' : 'Crear'} Evento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear/editar hito */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target size={20} className="text-blue-600" />
                {editingMilestone ? 'Editar Hito' : 'Nuevo Hito'} - {selectedDate?.toLocaleDateString()}
              </h3>
              <button onClick={() => setShowMilestoneModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Hito
                </label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Finalización Fase 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Descripción del hito..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={milestoneForm.status}
                    onChange={(e) => setMilestoneForm({...milestoneForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progreso (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={milestoneForm.progress}
                    onChange={(e) => setMilestoneForm({...milestoneForm, progress: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowMilestoneModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveMilestone}
                  disabled={!milestoneForm.title.trim()}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {editingMilestone ? 'Actualizar' : 'Crear'} Hito
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
              {item.type === 'milestone' ? (
                <Target size={16} className="text-blue-600" />
              ) : (
                <Calendar size={16} className="text-gray-400" />
              )}
              <div className="flex-1">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{new Date(item.due_date || item.dueDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.assignee_name}</span>
                  {item.type === 'milestone' && (
                    <>
                      <span>•</span>
                      <span className={item.status === 'completed' ? 'text-green-600' : 'text-blue-600'}>
                        {item.status === 'completed' ? 'Completado' : 
                         item.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                      </span>
                    </>
                  )}
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

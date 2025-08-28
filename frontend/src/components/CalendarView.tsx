import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react'

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const tasks = [
    {
      id: '1',
      title: 'Migración Clientes Corporativos',
      dueDate: '2025-02-15',
      assignee: 'María González',
      priority: 'high',
      region: 'CECA'
    },
    {
      id: '2',
      title: 'Configuración Equipos Regionales',
      dueDate: '2025-01-30',
      assignee: 'Carlos Ruiz',
      priority: 'medium',
      region: 'SOLA'
    },
    {
      id: '3',
      title: 'Definición Procesos EMx',
      dueDate: '2025-03-01',
      assignee: 'Ana López',
      priority: 'high',
      region: 'MX'
    },
    {
      id: '4',
      title: 'Capacitación Champions',
      dueDate: '2025-02-20',
      assignee: 'Pedro Martín',
      priority: 'medium',
      region: 'SNAP'
    }
  ]

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
    return tasks.filter(task => task.dueDate === dateStr)
  }

  const getMilestonesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return milestones.filter(milestone => milestone.date === dateStr)
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

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Calendario del Proyecto</h2>
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
                className={`min-h-[100px] p-2 border border-gray-100 ${
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
                      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors]}`}></div>
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === 'week' && (
        <div className="space-y-4">
          <div className="text-center text-gray-600">
            Vista semanal - Próximamente
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-4">Próximos Eventos</h3>
        <div className="space-y-2">
          {[...tasks, ...milestones.map(m => ({...m, dueDate: m.date, assignee: 'Sistema'}))]
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
            .map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                <Calendar size={16} className="text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{item.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarView

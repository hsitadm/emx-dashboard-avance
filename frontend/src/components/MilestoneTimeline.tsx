import { CheckCircle, Circle, Clock, Target } from 'lucide-react'

const MilestoneTimeline = () => {
  const milestones = [
    {
      id: '1',
      title: 'Kick-off del Proyecto',
      description: 'Inicio oficial de la transición EMx',
      dueDate: '2025-01-15',
      status: 'completed',
      progress: 100
    },
    {
      id: '2',
      title: 'Análisis y Planificación',
      description: 'Definición de alcance y recursos',
      dueDate: '2025-01-30',
      status: 'completed',
      progress: 100
    },
    {
      id: '3',
      title: 'Configuración Inicial',
      description: 'Setup de herramientas y equipos',
      dueDate: '2025-02-15',
      status: 'pending',
      progress: 75
    },
    {
      id: '4',
      title: 'Migración Fase 1',
      description: 'Migración de clientes prioritarios',
      dueDate: '2025-03-01',
      status: 'pending',
      progress: 30
    },
    {
      id: '5',
      title: 'Capacitación Equipos',
      description: 'Entrenamiento en nuevos procesos',
      dueDate: '2025-03-15',
      status: 'pending',
      progress: 0
    },
    {
      id: '6',
      title: 'Go-Live EMx',
      description: 'Lanzamiento oficial del nuevo servicio',
      dueDate: '2025-04-01',
      status: 'pending',
      progress: 0
    }
  ]

  const getStatusIcon = (status: string, progress: number) => {
    if (status === 'completed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    if (progress > 0) {
      return <Clock className="w-5 h-5 text-blue-600" />
    }
    return <Circle className="w-5 h-5 text-gray-400" />
  }

  const getStatusColor = (status: string, progress: number) => {
    if (status === 'completed') return 'border-green-600'
    if (progress > 0) return 'border-blue-600'
    return 'border-gray-300'
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Hitos del Proyecto</h2>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="relative">
            {/* Línea conectora */}
            {index < milestones.length - 1 && (
              <div className="absolute left-2.5 top-8 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            <div className="flex gap-4">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${getStatusColor(milestone.status, milestone.progress)} bg-white flex items-center justify-center`}>
                {getStatusIcon(milestone.status, milestone.progress)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        milestone.status === 'completed' 
                          ? 'bg-green-600' 
                          : milestone.progress > 0 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300'
                      }`}
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {milestone.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Completados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MilestoneTimeline

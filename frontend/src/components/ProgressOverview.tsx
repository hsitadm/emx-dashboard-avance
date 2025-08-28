import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'

const ProgressOverview = () => {
  const metrics = [
    {
      title: 'Progreso General',
      value: '68%',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Clientes Migrados',
      value: '142/200',
      change: '+8 esta semana',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Tareas Completadas',
      value: '89',
      change: '+15 hoy',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Días Restantes',
      value: '45',
      change: 'Para Q1 2025',
      icon: Clock,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Proyecto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-3`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {metric.title}
            </div>
            <div className="text-xs text-green-600 font-medium">
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Progreso por Región</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { region: 'CECA', progress: 75, tasks: 24 },
            { region: 'SOLA', progress: 68, tasks: 31 },
            { region: 'MX', progress: 82, tasks: 19 },
            { region: 'SNAP', progress: 45, tasks: 28 },
            { region: 'COEC', progress: 63, tasks: 22 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.region}</span>
                  <span className="text-gray-500">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm text-gray-500">
                {item.tasks} tareas
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressOverview

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { RefreshCw } from 'lucide-react'
import apiService from '../services/api.js'

const Charts = () => {
  const [regionData, setRegionData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [storyProgressData, setStoryProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    try {
      setLoading(true)
      
      // Obtener datos de tareas y historias
      const [tasks, stories, dashboardMetrics] = await Promise.all([
        apiService.getTasks(),
        apiService.request('/stories'),
        apiService.getDashboardMetrics()
      ])

      // Procesar datos por región
      const regionStats = {}
      
      if (tasks && tasks.length > 0) {
        tasks.forEach((task: any) => {
          const region = task.region || 'Sin región'
          if (!regionStats[region]) {
            regionStats[region] = { name: region, completed: 0, pending: 0, total: 0 }
          }
          regionStats[region].total++
          if (task.status === 'completed') {
            regionStats[region].completed++
          } else {
            regionStats[region].pending++
          }
        })
        
        setRegionData(Object.values(regionStats))
      } else {
        setRegionData([])
      }

      // Procesar datos por estado
      if (dashboardMetrics && dashboardMetrics.tasksByStatus) {
        const statusStats = dashboardMetrics.tasksByStatus.map((item: any) => ({
          name: getStatusLabel(item.status),
          value: item.count,
          color: getStatusColor(item.status)
        }))
        setStatusData(statusStats)
      }

      // Progreso de historias
      if (stories && stories.length > 0) {
        const storyProgress = stories.map((story: any) => {
          let shortName = story.title
          if (story.title.includes('Comunicación')) shortName = 'Comunicación'
          else if (story.title.includes('Transición')) shortName = 'Transición Equipos'
          else if (story.title.includes('Estabilización')) shortName = 'Estabilización'
          else if (story.title.includes('Nuevas Ofertas')) shortName = 'Nuevas Ofertas'
          else if (story.title.length > 15) shortName = story.title.substring(0, 15) + '...'
          
          return {
            name: shortName,
            fullName: story.title,
            progress: story.progress || 0,
            tasks: story.task_count || 0,
            completed: story.completed_tasks || 0,
            status: story.status
          }
        })
        setStoryProgressData(storyProgress)
      } else {
        setStoryProgressData([])
      }

    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in-progress': return 'En Progreso'
      case 'review': return 'En Revisión'
      case 'planning': return 'Planificación'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#3b82f6'
      case 'review': return '#f59e0b'
      case 'planning': return '#6b7280'
      default: return '#9ca3af'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botón de recarga */}
      <div className="flex justify-end">
        <button
          onClick={loadChartData}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <RefreshCw size={16} />
          Actualizar Datos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Tareas por Región */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tareas por Región 
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({regionData.length} regiones)
            </span>
          </h3>
          {regionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completadas" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🌍</div>
                <p>No hay datos por región</p>
                <p className="text-sm">Haz clic en "Actualizar Datos" para recargar</p>
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 text-center">
            {regionData.length > 0 
              ? `Verde = Completadas, Amarillo = Pendientes | Total: ${regionData.reduce((acc, r) => acc + r.total, 0)} tareas`
              : 'No hay datos disponibles'
            }
          </div>
        </div>

        {/* Gráfico Circular - Estado de Tareas */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>No hay datos de estado</p>
                <p className="text-sm">Los estados se mostrarán cuando haya tareas</p>
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 text-center">
            {statusData.length > 0 
              ? `Total de ${statusData.reduce((acc, item) => acc + item.value, 0)} tareas en el sistema`
              : 'Cargando distribución por estado...'
            }
          </div>
        </div>

        {/* Gráfico de Progreso de Historias */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso de Historias del Proyecto</h3>
          {storyProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={storyProgressData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-25}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Progreso (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'progress' ? `${value}%` : value,
                    name === 'progress' ? 'Progreso' : 
                    name === 'tasks' ? 'Total Tareas' : 
                    name === 'completed' ? 'Completadas' : name
                  ]}
                  labelFormatter={(label) => {
                    const story = storyProgressData.find(s => s.name === label)
                    return story ? story.fullName : label
                  }}
                  contentStyle={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="#3b82f6" 
                  name="Progreso"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <p>No hay historias disponibles</p>
                <p className="text-sm">Crea historias en la pestaña correspondiente</p>
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500 text-center">
            {storyProgressData.length > 0 
              ? 'Progreso calculado automáticamente basado en tareas completadas por historia'
              : 'Ve a la pestaña Historias para crear y gestionar historias del proyecto'
            }
          </div>
        </div>

        {/* Métricas Adicionales */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas del Proyecto</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {regionData.reduce((acc, region) => acc + region.total, 0)}
              </div>
              <div className="text-sm text-blue-700">Total Tareas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {regionData.reduce((acc, region) => acc + region.completed, 0)}
              </div>
              <div className="text-sm text-green-700">Completadas</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {storyProgressData.length}
              </div>
              <div className="text-sm text-yellow-700">Historias Activas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {storyProgressData.length > 0 
                  ? Math.round(storyProgressData.reduce((acc, story) => acc + story.progress, 0) / storyProgressData.length)
                  : 0}%
              </div>
              <div className="text-sm text-purple-700">Progreso Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts

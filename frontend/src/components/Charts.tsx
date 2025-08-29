import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
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

      // Procesar datos por estado usando métricas del dashboard
      const statusStats = dashboardMetrics.tasksByStatus.map((item: any) => ({
        name: getStatusLabel(item.status),
        value: item.count,
        color: getStatusColor(item.status)
      }))
      setStatusData(statusStats)

      // Progreso de historias para gráfico de línea
      const storyProgress = stories.map((story: any, index: number) => ({
        name: story.title.substring(0, 20) + (story.title.length > 20 ? '...' : ''),
        progress: story.progress || 0,
        tasks: story.task_count || 0,
        completed: story.completed_tasks || 0
      }))
      setStoryProgressData(storyProgress)

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Tareas por Región */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas por Región</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#10b981" name="Completadas" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pendientes" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Datos actualizados en tiempo real desde la base de datos
        </div>
      </div>

      {/* Gráfico Circular - Estado de Tareas */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
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
        <div className="mt-2 text-xs text-gray-500 text-center">
          Total de {statusData.reduce((acc, item) => acc + item.value, 0)} tareas en el sistema
        </div>
      </div>

      {/* Gráfico de Línea - Progreso de Historias */}
      <div className="card lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso de Historias del Proyecto</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={storyProgressData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'progress' ? `${value}%` : value,
                name === 'progress' ? 'Progreso' : name === 'tasks' ? 'Total Tareas' : 'Completadas'
              ]}
            />
            <Bar dataKey="progress" fill="#3b82f6" name="Progreso %" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Progreso calculado automáticamente basado en tareas completadas por historia
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
              {Math.round(storyProgressData.reduce((acc, story) => acc + story.progress, 0) / storyProgressData.length) || 0}%
            </div>
            <div className="text-sm text-purple-700">Progreso Promedio</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts

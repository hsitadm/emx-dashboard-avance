import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { RefreshCw, Target, BookOpen, CheckSquare } from 'lucide-react'
import api from '../services/api.js'

const Charts = () => {
  const [regionData, setRegionData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [milestoneData, setMilestoneData] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    try {
      setLoading(true)
      
      // Obtener datos de todas las entidades
      const [tasks, stories, milestones] = await Promise.all([
        api.getTasks(),
        api.getStories(),
        api.getMilestones()
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
      }

      // Procesar datos por estado (combinando tareas, historias y hitos)
      const statusStats = [
        { 
          name: 'Planificación', 
          tareas: tasks?.filter(t => t.status === 'planning').length || 0,
          historias: stories?.filter(s => s.status === 'planning').length || 0,
          hitos: milestones?.filter(m => m.status === 'planning').length || 0
        },
        { 
          name: 'En Progreso', 
          tareas: tasks?.filter(t => t.status === 'in-progress').length || 0,
          historias: stories?.filter(s => s.status === 'in-progress').length || 0,
          hitos: milestones?.filter(m => m.status === 'in-progress').length || 0
        },
        { 
          name: 'Completado', 
          tareas: tasks?.filter(t => t.status === 'completed').length || 0,
          historias: stories?.filter(s => s.status === 'completed').length || 0,
          hitos: milestones?.filter(m => m.status === 'completed').length || 0
        }
      ]
      setStatusData(statusStats)

      // Procesar datos de hitos con progreso
      if (milestones && milestones.length > 0) {
        const milestoneStats = milestones.map((milestone: any) => ({
          name: milestone.title.length > 15 ? milestone.title.substring(0, 15) + '...' : milestone.title,
          progreso: milestone.progress || 0,
          historias: milestone.stories_count || 0,
          estado: milestone.status
        }))
        setMilestoneData(milestoneStats)
      }

      // Datos de progreso general
      const progressStats = [
        {
          categoria: 'Hitos',
          promedio: milestones?.length > 0 ? Math.round(milestones.reduce((sum: number, m: any) => sum + (m.progress || 0), 0) / milestones.length) : 0,
          completados: milestones?.filter(m => m.status === 'completed').length || 0,
          total: milestones?.length || 0
        },
        {
          categoria: 'Historias',
          promedio: stories?.length > 0 ? Math.round(stories.reduce((sum: number, s: any) => sum + (s.story_progress || 0), 0) / stories.length) : 0,
          completados: stories?.filter(s => s.status === 'completed').length || 0,
          total: stories?.length || 0
        },
        {
          categoria: 'Tareas',
          promedio: tasks?.length > 0 ? Math.round(tasks.reduce((sum: number, t: any) => sum + (t.progress || 0), 0) / tasks.length) : 0,
          completados: tasks?.filter(t => t.status === 'completed').length || 0,
          total: tasks?.length || 0
        }
      ]
      setProgressData(progressStats)

    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1']

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📊 Análisis del Proyecto EMx</h2>
          <p className="text-sm text-gray-600 mt-1">Análisis completo de hitos, historias y tareas</p>
        </div>
        <button 
          onClick={loadChartData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {progressData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {item.categoria === 'Hitos' && <Target className="text-blue-600" size={24} />}
                {item.categoria === 'Historias' && <BookOpen className="text-purple-600" size={24} />}
                {item.categoria === 'Tareas' && <CheckSquare className="text-green-600" size={24} />}
                <h3 className="text-lg font-semibold text-gray-900">{item.categoria}</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">{item.promedio}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completados</span>
                <span className="font-medium">{item.completados}/{item.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${item.total > 0 ? (item.completados / item.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hitos" fill="#8884d8" name="Hitos" />
              <Bar dataKey="historias" fill="#82ca9d" name="Historias" />
              <Bar dataKey="tareas" fill="#ffc658" name="Tareas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Progress */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso de Hitos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={milestoneData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progreso" fill="#8884d8" name="Progreso %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Región</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Comparison */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Progreso</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="promedio" stroke="#8884d8" strokeWidth={3} name="Progreso Promedio %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Estadístico</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{milestoneData.length}</div>
            <div className="text-sm text-gray-600">Hitos Totales</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{progressData.find(p => p.categoria === 'Historias')?.total || 0}</div>
            <div className="text-sm text-gray-600">Historias Totales</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{progressData.find(p => p.categoria === 'Tareas')?.total || 0}</div>
            <div className="text-sm text-gray-600">Tareas Totales</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts

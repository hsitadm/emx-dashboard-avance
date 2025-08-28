import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const Charts = () => {
  const regionData = [
    { name: 'CECA', completed: 24, pending: 8, total: 32 },
    { name: 'SOLA', completed: 31, pending: 12, total: 43 },
    { name: 'MX', completed: 19, pending: 4, total: 23 },
    { name: 'SNAP', completed: 15, pending: 13, total: 28 },
    { name: 'COEC', completed: 18, pending: 9, total: 27 }
  ]

  const statusData = [
    { name: 'Completado', value: 89, color: '#10b981' },
    { name: 'En Progreso', value: 45, color: '#3b82f6' },
    { name: 'En Revisión', value: 23, color: '#f59e0b' },
    { name: 'Planificación', value: 12, color: '#6b7280' }
  ]

  const progressData = [
    { week: 'Sem 1', progress: 15 },
    { week: 'Sem 2', progress: 28 },
    { week: 'Sem 3', progress: 42 },
    { week: 'Sem 4', progress: 55 },
    { week: 'Sem 5', progress: 68 },
    { week: 'Sem 6', progress: 75 }
  ]

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
      </div>

      {/* Gráfico Circular - Estado de Tareas */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Tareas</h3>
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
      </div>

      {/* Gráfico de Línea - Progreso Semanal */}
      <div className="card lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso del Proyecto</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="progress" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Charts

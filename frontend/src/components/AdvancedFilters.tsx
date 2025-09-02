import { useState, useEffect } from 'react'
import { Filter, X, Calendar, User, MapPin } from 'lucide-react'
import { useStore } from '../store/useStore'

interface FilterProps {
  onFiltersChange: (filters: any) => void
}

const AdvancedFilters = ({ onFiltersChange }: FilterProps) => {
  const { users, loadUsers } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    region: '',
    assignee: '',
    priority: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  const regions = ['TODAS', 'CECA', 'SOLA', 'MX', 'SNAP', 'COEC']

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    console.log('Users loaded in AdvancedFilters:', users)
  }, [users])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      region: '',
      assignee: '',
      priority: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <Filter size={16} />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Filtros Avanzados</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Región */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={14} />
                Región
              </label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas las regiones</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'TODAS' ? '🌍 TODAS' : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Responsable */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={14} />
                Responsable
              </label>
              <select
                value={filters.assignee}
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos los responsables</option>
                {users && users.length > 0 ? users.map(user => (
                  <option key={user.id} value={user.id}>
                    👤 {user.name} ({user.role})
                  </option>
                )) : (
                  <option disabled>Cargando usuarios...</option>
                )}
              </select>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="planning">Planificación</option>
                <option value="in-progress">En Progreso</option>
                <option value="review">En Revisión</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            {/* Rango de Fechas */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar size={14} />
                Rango de Fechas
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Desde"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Hasta"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={clearFilters}
              className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters

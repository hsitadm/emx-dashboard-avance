import { useStore } from '../store/useStore'
import { LogOut, Settings } from 'lucide-react'

const Header = () => {
  const { user, setUser } = useStore()

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">EMx Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">{user?.name}</span>
              <span className="text-gray-500 ml-2">({user?.role})</span>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings size={20} />
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

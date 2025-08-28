import { useStore } from './store/useStore'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

function App() {
  const user = useStore(state => state.user)

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Dashboard /> : <Login />}
    </div>
  )
}

export default App

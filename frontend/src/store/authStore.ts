import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  region: string
  created_at?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  allUsers: User[]
  login: (email: string) => Promise<void>
  logout: () => void
  canEdit: () => boolean
  canAdmin: () => boolean
  canView: (tab: string) => boolean
  addUser: (userData: Omit<User, 'id' | 'created_at'>) => void
  updateUser: (id: number, userData: Partial<User>) => void
  deleteUser: (id: number) => void
}

// Usuarios de prueba
const initialUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@emx.com', role: 'admin', region: 'TODAS', created_at: '2024-01-15' },
  { id: 2, name: 'Editor User', email: 'editor@emx.com', role: 'editor', region: 'CECA', created_at: '2024-02-10' },
  { id: 3, name: 'Viewer User', email: 'viewer@emx.com', role: 'viewer', region: 'SOLA', created_at: '2024-03-05' }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      allUsers: initialUsers,

      login: async (email: string) => {
        // Buscar usuario de prueba
        const { allUsers } = get()
        const user = allUsers.find(u => u.email === email)
        
        if (!user) {
          throw new Error('Usuario no encontrado')
        }

        set({
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      addUser: (userData) => {
        const { allUsers } = get()
        const newUser: User = {
          ...userData,
          id: Math.max(...allUsers.map(u => u.id)) + 1,
          created_at: new Date().toISOString().split('T')[0]
        }
        
        set({
          allUsers: [...allUsers, newUser]
        })
      },

      updateUser: (id, userData) => {
        const { allUsers } = get()
        set({
          allUsers: allUsers.map(user => 
            user.id === id ? { ...user, ...userData } : user
          )
        })
      },

      deleteUser: (id) => {
        const { allUsers } = get()
        set({
          allUsers: allUsers.filter(user => user.id !== id)
        })
      },

      canEdit: () => {
        const { user } = get()
        return user ? ['admin', 'editor'].includes(user.role) : false
      },

      canAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      canView: (tab: string) => {
        const { user } = get()
        if (!user) return false

        // Admin puede ver todo
        if (user.role === 'admin') return true

        // Viewer solo puede ver: resumen, análisis, calendario
        if (user.role === 'viewer') {
          return ['dashboard', 'analytics', 'calendar'].includes(tab)
        }

        // Editor puede ver todo excepto usuarios
        if (user.role === 'editor') {
          return tab !== 'users'
        }

        return true
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

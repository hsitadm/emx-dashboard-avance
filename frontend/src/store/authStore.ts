import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  region: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string) => Promise<void>
  logout: () => void
  canEdit: () => boolean
  canAdmin: () => boolean
  canView: (tab: string) => boolean
}

// Usuarios de prueba
const testUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@emx.com', role: 'admin', region: 'TODAS' },
  { id: 2, name: 'Editor User', email: 'editor@emx.com', role: 'editor', region: 'CECA' },
  { id: 3, name: 'Viewer User', email: 'viewer@emx.com', role: 'viewer', region: 'SOLA' }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string) => {
        // Buscar usuario de prueba
        const user = testUsers.find(u => u.email === email)
        
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

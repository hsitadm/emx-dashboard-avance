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
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginAsViewer: () => void
  logout: () => void
  canEdit: () => boolean
  canAdmin: () => boolean
  canView: (tab: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Error en login')
          }

          const data = await response.json()
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          })
        } catch (error) {
          throw error
        }
      },

      loginAsViewer: () => {
        const viewerUser: User = {
          id: 0,
          name: 'Usuario Invitado',
          email: 'viewer@guest.com',
          role: 'viewer',
          region: 'TODAS'
        }
        
        set({
          user: viewerUser,
          token: null,
          isAuthenticated: true,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      canEdit: () => {
        const { user } = get()
        return user?.role === 'admin' || user?.role === 'editor'
      },

      canAdmin: () => {
        const { user } = get()
        return user?.role === 'admin'
      },

      canView: (tab: string) => {
        const { user } = get()
        if (!user) return false
        
        if (user.role === 'admin') return true
        if (user.role === 'editor') return tab !== 'users'
        return tab === 'dashboard' || tab === 'tasks'
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

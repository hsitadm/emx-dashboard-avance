import { create } from 'zustand'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  region: string
  created_at: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  allUsers: User[]
  login: (email: string) => Promise<void>
  loginAsViewer: () => void
  logout: () => void
  canEdit: () => boolean
  canAdmin: () => boolean
  canView: (tab: string) => boolean
  addUser: (userData: Omit<User, 'id' | 'created_at'>) => Promise<void>
  updateUser: (id: number, userData: Partial<User>) => Promise<void>
  deleteUser: (id: number) => Promise<void>
}

// Usuarios de prueba
const initialUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@emx.com', role: 'admin', region: 'TODAS', created_at: '2024-01-15' },
  { id: 2, name: 'Jose Porras', email: 'jose@emx.com', role: 'editor', region: 'SOLA', created_at: '2024-01-20' },
  { id: 3, name: 'Hector Sandoval', email: 'hector@emx.com', role: 'editor', region: 'MX', created_at: '2024-01-25' },
  { id: 4, name: 'Hector Martinez', email: 'hector.m@emx.com', role: 'editor', region: 'CECA', created_at: '2024-02-01' },
  { id: 5, name: 'Alvaro Hernandez', email: 'alvaro@emx.com', role: 'editor', region: 'SNAP', created_at: '2024-02-05' },
  { id: 6, name: 'Rafael Gutierrez', email: 'rafael@emx.com', role: 'admin', region: 'COEC', created_at: '2024-02-10' },
  { id: 7, name: 'Maria Gonzalez', email: 'maria@emx.com', role: 'viewer', region: 'CECA', created_at: '2024-02-15' },
  { id: 8, name: 'Usuario Demo', email: 'demo@emx.com', role: 'viewer', region: 'TODAS', created_at: '2024-02-20' }
]

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  allUsers: initialUsers,

  login: async (email: string) => {
    // Solo permitir login a administradores registrados
    const { allUsers } = get()
    const user = allUsers.find(u => u.email === email && u.role === 'admin')
    
    if (!user) {
      throw new Error('Solo administradores pueden hacer login con credenciales')
    }

    localStorage.removeItem('hasLoggedOut')
    set({
      user,
      isAuthenticated: true,
    })
  },

  loginAsViewer: () => {
    // Crear usuario viewer temporal
    const viewerUser: User = {
      id: 0,
      name: 'Usuario Invitado',
      email: 'viewer@guest.com',
      role: 'viewer',
      region: 'TODAS',
      created_at: new Date().toISOString().split('T')[0]
    }

    localStorage.removeItem('hasLoggedOut')
    set({
      user: viewerUser,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.setItem('hasLoggedOut', 'true')
    set({
      user: null,
      isAuthenticated: false,
    })
  },

  addUser: async (userData) => {
    try {
      // Create in database via API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      
      const newUser = await response.json()
      
      // Update local state
      const { allUsers } = get()
      set({
        allUsers: [...allUsers, newUser]
      })
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  updateUser: async (id, userData) => {
    try {
      // Update in database via API
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      
      const updatedUser = await response.json()
      
      // Update local state
      const { allUsers } = get()
      set({
        allUsers: allUsers.map(user => 
          user.id === id ? { ...user, ...updatedUser } : user
        )
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  deleteUser: async (id) => {
    try {
      // Delete from database via API
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      // Update local state
      const { allUsers } = get()
      set({
        allUsers: allUsers.filter(user => user.id !== id)
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
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
}))

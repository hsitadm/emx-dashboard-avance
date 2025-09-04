import { create } from 'zustand'
import { signIn, signOut, getCurrentUser, fetchUserAttributes, confirmSignIn } from 'aws-amplify/auth'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'viewer'
  region: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  needsPasswordChange: boolean
  login: (email: string, password: string) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  logout: () => Promise<void>
  checkCurrentUser: () => Promise<void>
  canEdit: () => boolean
  canAdmin: () => boolean
  canView: (tab: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  needsPasswordChange: false,

  login: async (email: string, password: string) => {
    try {
      const result = await signIn({ username: email, password })
      
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        set({ needsPasswordChange: true })
        throw new Error('NEW_PASSWORD_REQUIRED')
      }
      
      await get().checkCurrentUser()
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.name === 'NotAuthorizedException') {
        throw new Error('Credenciales inválidas')
      }
      throw error
    }
  },

  changePassword: async (newPassword: string) => {
    try {
      await confirmSignIn({ challengeResponse: newPassword })
      set({ needsPasswordChange: false })
      setTimeout(() => {
        get().checkCurrentUser()
      }, 1000)
    } catch (error: any) {
      console.error('Change password error:', error)
      throw error
    }
  },


  checkCurrentUser: async () => {
    try {
      const currentUser = await getCurrentUser()
      const attributes = await fetchUserAttributes()
      
      const user: User = {
        id: currentUser.userId,
        name: attributes.name || '',
        email: attributes.email || '',
        role: attributes['custom:role'] as any || 'viewer',
        region: attributes['custom:region'] || 'TODAS'
      }
      
      set({ user, isAuthenticated: true, loading: false })
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false })
    }
  },

  logout: async () => {
    try {
      await signOut()
      set({ 
        user: null, 
        isAuthenticated: false, 
        needsPasswordChange: false 
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  canEdit: () => {
    const { user } = get()
    return user?.role === 'admin'
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
    
    // Viewer solo puede ver: resumen, analisis, calendario
    if (user.role === 'viewer') {
      return ['overview', 'analytics', 'calendar'].includes(tab)
    }
    
    return false
  }
}))

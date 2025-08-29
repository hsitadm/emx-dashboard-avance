import { create } from 'zustand'
import apiService from '../services/api.js'

interface User {
  id: string
  name: string
  role: string
  region?: string
}

interface Task {
  id: string
  title: string
  description: string
  status: 'planning' | 'in-progress' | 'completed' | 'review'
  assignee_name?: string
  assignee_id?: number
  due_date: string
  priority: 'low' | 'medium' | 'high'
  region?: string
  progress?: number
}

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
}

interface Store {
  user: User | null
  tasks: Task[]
  notifications: Notification[]
  loading: boolean
  
  // Actions
  setUser: (user: User) => void
  loadTasks: (filters?: any) => Promise<void>
  addTask: (task: Omit<Task, 'id'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  tasks: [],
  notifications: [],
  loading: false,

  setUser: (user) => set({ user }),

  loadTasks: async (filters = {}) => {
    try {
      set({ loading: true })
      const tasks = await apiService.getTasks(filters)
      set({ tasks, loading: false })
    } catch (error) {
      console.error('Error loading tasks:', error)
      set({ loading: false })
      get().addNotification({
        message: 'Error al cargar las tareas',
        type: 'error'
      })
    }
  },

  addTask: async (taskData) => {
    try {
      const newTask = await apiService.createTask(taskData)
      set(state => ({ 
        tasks: [newTask, ...state.tasks]
      }))
      get().addNotification({
        message: 'Tarea creada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating task:', error)
      get().addNotification({
        message: 'Error al crear la tarea',
        type: 'error'
      })
    }
  },

  updateTask: async (id, updates) => {
    try {
      const updatedTask = await apiService.updateTask(id, updates)
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updatedTask } : task
        )
      }))
      get().addNotification({
        message: 'Tarea actualizada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error updating task:', error)
      get().addNotification({
        message: 'Error al actualizar la tarea',
        type: 'error'
      })
    }
  },

  deleteTask: async (id) => {
    try {
      await apiService.request(`/tasks/${id}`, { method: 'DELETE' })
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))
      get().addNotification({
        message: 'Tarea eliminada exitosamente',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      get().addNotification({
        message: 'Error al eliminar la tarea',
        type: 'error'
      })
    }
  },

  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification = {
      ...notification,
      id,
      timestamp: new Date()
    }
    
    set(state => ({
      notifications: [...state.notifications, newNotification]
    }))

    // Auto remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id)
    }, 5000)
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  }
}))

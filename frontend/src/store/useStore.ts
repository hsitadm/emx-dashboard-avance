import { create } from 'zustand'

export interface User {
  id: string
  name: string
  role: 'director' | 'regional' | 'service-delivery' | 'emx-champion' | 'emx-leader' | 'collaborator'
  region?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'planning' | 'in-progress' | 'completed' | 'review'
  assignee: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  region?: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'completed'
  progress: number
}

interface AppState {
  user: User | null
  tasks: Task[]
  milestones: Milestone[]
  setUser: (user: User) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addMilestone: (milestone: Milestone) => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  tasks: [],
  milestones: [],
  
  setUser: (user) => set({ user }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  addMilestone: (milestone) => set((state) => ({ 
    milestones: [...state.milestones, milestone] 
  })),
  
  updateMilestone: (id, updates) => set((state) => ({
    milestones: state.milestones.map(milestone => 
      milestone.id === id ? { ...milestone, ...updates } : milestone
    )
  }))
}))

const API_BASE_URL = '/api'

class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Stories
  async getStories() {
    return this.request('/stories')
  }

  async createStory(story: any) {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(story),
    })
  }

  async updateStory(id: number, story: any) {
    return this.request(`/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(story),
    })
  }

  async deleteStory(id: number) {
    return this.request(`/stories/${id}`, {
      method: 'DELETE',
    })
  }

  // Tasks
  async getTasks() {
    return this.request('/tasks')
  }

  async createTask(task: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  }

  async updateTask(id: number, task: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    })
  }

  async deleteTask(id: number) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Milestones
  async getMilestones() {
    return this.request('/milestones')
  }

  async createMilestone(milestone: any) {
    return this.request('/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone),
    })
  }

  async updateMilestone(id: number, milestone: any) {
    return this.request(`/milestones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(milestone),
    })
  }

  async deleteMilestone(id: number) {
    return this.request(`/milestones/${id}`, {
      method: 'DELETE',
    })
  }

  // Users
  async getUsers() {
    return this.request('/users')
  }

  async createUser(user: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  async updateUser(id: number, user: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    })
  }

  async deleteUser(id: number) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  // Dashboard
  async getDashboardMetrics() {
    return this.request('/dashboard/metrics')
  }

  // Auth
  async getCurrentUser() {
    return this.request('/auth/me')
  }
}

export const apiService = new ApiService()
export default apiService

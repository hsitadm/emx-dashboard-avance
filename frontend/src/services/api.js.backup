const API_BASE_URL = '/api'

// Función para obtener el token del store
const getAuthToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      return parsed.state?.token || null
    }
  } catch (error) {
    console.error('Error getting auth token:', error)
  }
  return null
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Obtener token y agregarlo a headers
    const token = getAuthToken()
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      headers,
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

  async createStory(story) {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(story),
    })
  }

  async updateStory(id, story) {
    return this.request(`/stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(story),
    })
  }

  async deleteStory(id) {
    return this.request(`/stories/${id}`, {
      method: 'DELETE',
    })
  }

  // Tasks
  async getTasks() {
    return this.request('/tasks')
  }

  async createTask(task) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  }

  async updateTask(id, task) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    })
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Milestones
  async getMilestones() {
    return this.request('/milestones')
  }

  async createMilestone(milestone) {
    return this.request('/milestones', {
      method: 'POST',
      body: JSON.stringify(milestone),
    })
  }

  async updateMilestone(id, milestone) {
    return this.request(`/milestones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(milestone),
    })
  }

  async deleteMilestone(id) {
    return this.request(`/milestones/${id}`, {
      method: 'DELETE',
    })
  }

  // Users
  async getUsers() {
    return this.request('/users')
  }

  async createUser(user) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  async updateUser(id, user) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    })
  }

  async deleteUser(id) {
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

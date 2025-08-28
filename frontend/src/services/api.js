const API_BASE_URL = 'http://localhost:3001/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
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

  // Tasks
  async getTasks(filters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request(`/tasks${query}`)
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  }

  async getTaskComments(taskId) {
    return this.request(`/tasks/${taskId}/comments`)
  }

  async addTaskComment(taskId, content, authorId = 8) {
    return this.request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, author_id: authorId }),
    })
  }

  // Users
  async getUsers() {
    return this.request('/users')
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

export default new ApiService()

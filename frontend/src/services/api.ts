const API_BASE_URL = '/api'

const request = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  
  if (!response.ok) {
    throw new Error()
  }
  
  return response
}

export const api = {
  // Tasks
  getTasks: async () => {
    const response = await request()
    return response.json()
  },
  
  createTask: async (task: any) => {
    const response = await request(, {
      method: 'POST',
      body: JSON.stringify(task)
    })
    return response.json()
  },
  
  updateTask: async (id: number, task: any) => {
    const response = await request(, {
      method: 'PUT',
      body: JSON.stringify(task)
    })
    return response.json()
  },
  
  deleteTask: async (id: number) => {
    return request(, {
      method: 'DELETE'
    })
  },

  // Stories
  getStories: async () => {
    const response = await request()
    return response.json()
  },
  
  createStory: async (story: any) => {
    const response = await request(, {
      method: 'POST',
      body: JSON.stringify(story)
    })
    return response.json()
  },
  
  updateStory: async (id: number, story: any) => {
    const response = await request(, {
      method: 'PUT',
      body: JSON.stringify(story)
    })
    return response.json()
  },
  
  deleteStory: async (id: number) => {
    return request(, {
      method: 'DELETE'
    })
  },

  // Milestones
  getMilestones: async () => {
    const response = await request()
    return response.json()
  },
  
  createMilestone: async (milestone: any) => {
    const response = await request(, {
      method: 'POST',
      body: JSON.stringify(milestone)
    })
    return response.json()
  },
  
  updateMilestone: async (id: number, milestone: any) => {
    const response = await request(, {
      method: 'PUT',
      body: JSON.stringify(milestone)
    })
    return response.json()
  },
  
  deleteMilestone: async (id: number) => {
    return request(, {
      method: 'DELETE'
    })
  },

  // Dashboard
  getDashboardData: async () => {
    const response = await request()
    return response.json()
  },

  // Users
  getUsers: async () => {
    const response = await request()
    return response.json()
  },
  
  getCurrentUser: async () => {
    const response = await request()
    return response.json()
  }
}

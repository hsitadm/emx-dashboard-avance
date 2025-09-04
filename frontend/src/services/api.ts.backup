const API_BASE_URL = '/api';

export const api = {
  // Tasks
  getTasks: () => fetch(`${API_BASE_URL}/tasks`).then(res => res.json()),
  createTask: (task: any) => fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(res => res.json()),
  updateTask: (id: number, task: any) => fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }).then(res => res.json()),
  deleteTask: (id: number) => fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE'
  }),

  // Stories
  getStories: () => fetch(`${API_BASE_URL}/stories`).then(res => res.json()),
  createStory: (story: any) => fetch(`${API_BASE_URL}/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story)
  }).then(res => res.json()),
  updateStory: (id: number, story: any) => fetch(`${API_BASE_URL}/stories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(story)
  }).then(res => res.json()),
  deleteStory: (id: number) => fetch(`${API_BASE_URL}/stories/${id}`, {
    method: 'DELETE'
  }),

  // Milestones
  getMilestones: () => fetch(`${API_BASE_URL}/milestones`).then(res => res.json()),
  createMilestone: (milestone: any) => fetch(`${API_BASE_URL}/milestones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(milestone)
  }).then(res => res.json()),
  updateMilestone: (id: number, milestone: any) => fetch(`${API_BASE_URL}/milestones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(milestone)
  }).then(res => res.json()),
  deleteMilestone: (id: number) => fetch(`${API_BASE_URL}/milestones/${id}`, {
    method: 'DELETE'
  }),

  // Users
  getUsers: () => fetch(`${API_BASE_URL}/users`).then(res => res.json()),
  getCurrentUser: () => fetch(`${API_BASE_URL}/users/current`).then(res => res.json())
};

export default api;

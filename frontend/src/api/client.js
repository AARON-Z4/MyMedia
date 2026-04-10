const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Projects
  getProjects: (page = 1, limit = 10) => req(`/projects?page=${page}&limit=${limit}`),
  getProject: (id) => req(`/projects/${id}`),
  createProject: (body) => req('/projects', { method: 'POST', body }),
  deleteProject: (id) => req(`/projects/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (projectId, params = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/projects/${projectId}/tasks${q ? `?${q}` : ''}`);
  },
  createTask: (projectId, body) =>
    req(`/projects/${projectId}/tasks`, { method: 'POST', body }),
  updateTask: (id, body) => req(`/tasks/${id}`, { method: 'PUT', body }),
  deleteTask: (id) => req(`/tasks/${id}`, { method: 'DELETE' }),
};

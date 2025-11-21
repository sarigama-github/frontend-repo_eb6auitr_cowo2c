export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  seed: () => request('/api/seed', { method: 'POST' }),
  contentList: (limit = 50) => request(`/api/content?limit=${limit}`),
  contentById: (id) => request(`/api/content/${id}`),
  profile: () => request('/api/profile'),
  submitSession: (payload) => request('/api/session', { method: 'POST', body: JSON.stringify(payload) }),
};

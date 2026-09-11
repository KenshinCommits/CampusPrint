const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('cp_token');
}

async function request(path, { method = 'GET', body, isMultipart = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isMultipart && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  me: () => request('/api/auth/me'),

  placeOrder: (formData) => request('/api/orders', { method: 'POST', body: formData, isMultipart: true }),
  myOrders: () => request('/api/orders/mine'),
  getOrder: (id) => request(`/api/orders/${id}`),
  payOrder: (id) => request(`/api/orders/${id}/pay`, { method: 'POST' }),
  cancelOrder: (id) => request(`/api/orders/${id}`, { method: 'DELETE' }),

  staffOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/staff/orders${qs ? `?${qs}` : ''}`);
  },
  staffOrder: (id) => request(`/api/staff/orders/${id}`),
  staffFileUrl: (id) => `${API_URL}/api/staff/orders/${id}/file?token=${encodeURIComponent(getToken() || '')}`,
  updateStatus: (id, payload) => request(`/api/staff/orders/${id}/status`, { method: 'PATCH', body: payload }),
  staffStats: () => request('/api/staff/stats'),
};

export { API_URL };

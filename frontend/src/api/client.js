// Always use relative '/api' in production so requests resolve to the current host
// (ALB or HTTPS tunnel) without hardcoding task IPs or triggering CORS / SSL errors.
const isLocalDev = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  (window.location.port === '5173' || window.location.port === '3000');

export const baseURL = isLocalDev ? 'http://localhost:4000/api' : '/api';

export function getToken() {
  return localStorage.getItem('cp_token') || localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('cp_token', token);
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('cp_token');
  localStorage.removeItem('token');
}

async function request(endpoint, { method = 'GET', body, isMultipart = false } = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers = {};

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isMultipart && body && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    method,
    headers,
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const errorMsg = (data && data.error) || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  baseURL,
  // Auth endpoints
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),

  // Student Order endpoints
  placeOrder: (formData) => request('/orders', { method: 'POST', body: formData, isMultipart: true }),
  myOrders: () => request('/orders/mine'),
  getOrder: (id) => request(`/orders/${id}`),
  orderFileUrl: (id) => `${baseURL}/orders/${id}/file?token=${encodeURIComponent(getToken() || '')}`,
  payOrder: (id) => request(`/orders/${id}/pay`, { method: 'POST' }),
  cancelOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Staff endpoints
  staffOrders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/staff/orders${qs ? `?${qs}` : ''}`);
  },
  staffOrder: (id) => request(`/staff/orders/${id}`),
  staffFileUrl: (id) => `${baseURL}/staff/orders/${id}/file?token=${encodeURIComponent(getToken() || '')}`,
  updateStatus: (id, payload) => request(`/staff/orders/${id}/status`, { method: 'PATCH', body: payload }),
  staffStats: () => request('/staff/stats'),
};

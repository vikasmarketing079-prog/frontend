import axios from 'axios';

const isBrowser = typeof window !== 'undefined';
let rawBase = ((import.meta as any).env?.VITE_API_URL || '').trim();

// Automatically correct the URL if it points to the old siteaudit-backend without -j08w
if (
  rawBase === 'https://siteaudit-backend.onrender.com' ||
  rawBase === 'https://siteaudit-backend.onrender.com/' ||
  rawBase === 'http://siteaudit-backend.onrender.com'
) {
  rawBase = 'https://siteaudit-backend-j08w.onrender.com';
}

if (!rawBase && isBrowser && window.location.hostname.includes('render.com')) {
  rawBase = 'https://siteaudit-backend-j08w.onrender.com';
}

export const apiBase = rawBase ? `${rawBase.replace(/\/$/, '')}/api` : '/api';

export const API = axios.create({
  baseURL: apiBase,
  timeout: 25000, // 25s timeout prevents UI from hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to give clear error messages instead of raw network failures
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new Error(`Server at ${apiBase} timed out. Please check if your Render backend is Live and awake.`));
    }
    if (!error.response && error.message === 'Network Error') {
      return Promise.reject(new Error(`Cannot connect to backend (${apiBase}). Check your Render backend URL or CORS settings.`));
    }
    return Promise.reject(error);
  }
);

// Attach Authorization token from localStorage if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('siteaudit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Persistent guest session id for guests
  let guestId = localStorage.getItem('siteaudit_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('siteaudit_guest_id', guestId);
  }
  config.headers['x-guest-session-id'] = guestId;

  return config;
});

// API helper functions
export const auditApi = {
  start: (data: { url: string; maxPages?: number; crawlDepth?: number; websiteId?: string }) =>
    API.post('/audits/start', data),
  getById: (id: string) => API.get(`/audits/${id}`),
  getProgress: (id: string) => API.get(`/audits/${id}/progress`),
  getIssues: (id: string, params?: { category?: string; severity?: string; search?: string }) =>
    API.get(`/audits/${id}/issues`, { params }),
  getPages: (id: string) => API.get(`/audits/${id}/pages`),
  getPdfUrl: (id: string) => `${apiBase}/audits/${id}/pdf`,
  getCsvUrl: (id: string) => `${apiBase}/audits/${id}/export/csv`,
  rescan: (id: string) => API.post(`/audits/${id}/rescan`),
  compare: (id: string, previousAuditId: string) => API.get(`/audits/${id}/compare/${previousAuditId}`),
  emailReport: (id: string, email: string) => API.post(`/audits/reports/${id}/email`, { email }),
  getDemo: () => API.get('/audits/demo'),
};

export const toolsApi = {
  checkSeo: (url: string) => API.post('/tools/seo', { url }),
  checkSpeed: (url: string) => API.post('/tools/speed', { url }),
  checkBrokenLinks: (url: string) => API.post('/tools/broken-links', { url }),
  checkSsl: (url: string) => API.post('/tools/ssl', { url }),
  checkMobile: (url: string) => API.post('/tools/mobile', { url }),
  checkSecurityHeaders: (url: string) => API.post('/tools/security-headers', { url }),
  runBattle: (urlA: string, urlB: string) => API.post('/tools/battle', { urlA, urlB }),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) => API.post('/auth/login', credentials),
  register: (data: { name: string; email: string; password: string; companyName?: string }) =>
    API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data: any) => API.put('/auth/profile', data),
  forgotPassword: (email: string) => API.post('/auth/forgot-password', { email }),
};

export const websiteApi = {
  list: () => API.get('/websites'),
  create: (data: { url: string; name?: string; defaultMaxPages?: number }) => API.post('/websites', data),
  getById: (id: string) => API.get(`/websites/${id}`),
  delete: (id: string) => API.delete(`/websites/${id}`),
};

export const dashboardApi = {
  getOverview: () => API.get('/dashboard/overview'),
};

export const subscriptionApi = {
  getPlans: () => API.get('/subscriptions/plans'),
  checkout: (data: { planId: string; provider?: string }) => API.post('/subscriptions/checkout', data),
  changeTier: (plan: string) => API.post('/subscriptions/tier', { plan }),
};


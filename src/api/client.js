const API_BASE = '';

function getToken() {
  return localStorage.getItem('hkd_admin_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok && data.message) throw new Error(data.message);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  return data;
}

export const api = {
  login: (username, password) =>
    request('/wp-json/hkd-events/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, remember: true }),
    }),

  logout: () =>
    request('/wp-json/hkd-events/v1/auth/logout', { method: 'POST' }),

  getMe: () => request('/wp-json/hkd-events/v1/admin/me'),

  getDashboardStats: () => request('/api/admin/dashboard/stats'),

  listEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/wp-json/hkd-events/v1/admin/events?${qs}`);
  },

  getEvent: (id) => request(`/wp-json/hkd-events/v1/admin/events/${id}`),

  listBookings: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/wp-json/hkd-events/v1/admin/bookings?${qs}`);
  },

  getBooking: (id) => request(`/wp-json/hkd-events/v1/admin/bookings/${id}`),

  checkinBooking: (id) =>
    request(`/wp-json/hkd-events/v1/admin/bookings/${id}/checkin`, {
      method: 'POST',
      body: '{}',
    }),

  searchTickets: (q, params = {}) => {
    const qs = new URLSearchParams({ q, ...params }).toString();
    return request(`/wp-json/hkd-events/v1/admin/tickets/search?${qs}`);
  },

  verifyTicket: (token) =>
    request(`/wp-json/hkd-events/v1/tickets/${token}/verify`),

  checkinTicket: (token) =>
    request(`/wp-json/hkd-events/v1/tickets/${token}/checkin`, {
      method: 'POST',
      body: '{}',
    }),

  triggerSync: () =>
    request('/wp-json/hkd-events/v1/sync/trigger', { method: 'POST' }),

  getSyncStatus: () => request('/wp-json/hkd-events/v1/sync/status'),

  changePassword: (currentPassword, newPassword) =>
    request('/wp-json/hkd-events/v1/admin/me/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

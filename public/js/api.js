/**
 * Kynovia AI - Centralized Frontend API Client
 * Uses native Fetch API and handles JWT token injection.
 */

const API = {
  baseUrl: '/api',

  getToken() {
    return localStorage.getItem('kynovia_token') || '';
  },

  setToken(token) {
    if (token) localStorage.setItem('kynovia_token', token);
    else localStorage.removeItem('kynovia_token');
  },

  getUser() {
    try {
      const u = localStorage.getItem('kynovia_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) localStorage.setItem('kynovia_user', JSON.stringify(user));
    else localStorage.removeItem('kynovia_user');
  },

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Network request failed.');
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth Endpoints
  async register(payload) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async sendOtp(mobile) {
    return this.request('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  },

  async verifyOtp(mobile, otp) {
    const res = await this.request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });
    if (res.token) {
      this.setToken(res.token);
      this.setUser(res.user);
    }
    return res;
  },

  async ensureAuthenticated() {
    if (!this.getToken() || !this.getUser()) {
      try {
        const res = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'patient@kynovia.ai', password: 'Kynovia@2026' }),
        });
        const data = await res.json();
        if (data.token) {
          this.setToken(data.token);
          this.setUser(data.user);
          return data.user;
        }
      } catch (err) {
        console.warn('Auto demo authentication failed:', err);
      }
    }
    return this.getUser();
  },

  async loginAsDemo(role = 'patient') {
    const creds = {
      patient: { email: 'patient@kynovia.ai', pass: 'Kynovia@2026', redirect: '/' },
      doctor: { email: 'rajeshwar.sharma@kynovia.ai', pass: 'Kynovia@2026', redirect: '/doctor-dashboard.html' },
      admin: { email: 'admin@kynovia.ai', pass: 'Kynovia@2026', redirect: '/admin-dashboard.html' },
    };
    const c = creds[role] || creds.patient;
    const res = await this.login(c.email, c.pass);
    window.location.href = c.redirect;
    return res;
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
    window.location.href = '/login.html';
  },

  // Doctors
  async getDoctors(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(`/doctors${qs ? '?' + qs : ''}`);
  },

  async getDoctorById(id) {
    return this.request(`/doctors/${id}`);
  },

  async getDoctorAvailability(id) {
    return this.request(`/doctors/${id}/availability`);
  },

  async updateAvailability(schedule) {
    return this.request('/availability', {
      method: 'PUT',
      body: JSON.stringify({ schedule }),
    });
  },

  // Appointments
  async bookAppointment(payload) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMyAppointments() {
    return this.request('/appointments/my');
  },

  async cancelAppointment(id) {
    return this.request(`/appointments/${id}/cancel`, {
      method: 'POST',
    });
  },

  // Reviews
  async submitReview(payload) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // AI Recommendation Engine
  async recommend(symptoms, city = 'Bengaluru') {
    return this.request('/recommend', {
      method: 'POST',
      body: JSON.stringify({ symptoms, city }),
    });
  },

  async getSymptoms() {
    return this.request('/symptoms');
  },

  // Chatbot
  async sendChatMessage(message, history = []) {
    return this.request('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  },

  // Stats & Notifications
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  },

  async getNotifications() {
    return this.request('/notifications');
  },
};

window.API = API;

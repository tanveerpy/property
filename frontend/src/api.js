// API Client for Real Estate Management System

const API_BASE = '/api';

export const api = {
  // Properties
  async getProperties(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
    return res.json();
  },

  async getProperty(id) {
    const res = await fetch(`${API_BASE}/properties/${id}`);
    return res.json();
  },

  async createProperty(data) {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProperty(id, data) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProperty(id) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Agents
  async getAgents() {
    const res = await fetch(`${API_BASE}/agents`);
    return res.json();
  },

  async createAgent(data) {
    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Offices
  async getOffices() {
    const res = await fetch(`${API_BASE}/offices`);
    return res.json();
  },

  // Buyers & Sellers
  async getBuyers() {
    const res = await fetch(`${API_BASE}/buyers`);
    return res.json();
  },

  async createBuyer(data) {
    const res = await fetch(`${API_BASE}/buyers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteBuyer(id) {
    const res = await fetch(`${API_BASE}/buyers/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getSellers() {
    const res = await fetch(`${API_BASE}/sellers`);
    return res.json();
  },

  async createSeller(data) {
    const res = await fetch(`${API_BASE}/sellers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteSeller(id) {
    const res = await fetch(`${API_BASE}/sellers/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Transactions / Deal Closures
  async getTransactions() {
    const res = await fetch(`${API_BASE}/transactions`);
    return res.json();
  },

  async closeDeal(data) {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Analytics & Queries
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/stats`);
    return res.json();
  },

  async runQuery(type) {
    const res = await fetch(`${API_BASE}/queries?type=${type}`);
    return res.json();
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  }
};

export const formatCurrency = (val) => {
  if (!val && val !== 0) return 'PKR 0';
  const num = Number(val);
  if (num >= 10000000) return `PKR ${(num / 10000000).toFixed(2)} Crore`;
  if (num >= 100000) return `PKR ${(num / 100000).toFixed(2)} Lakh`;
  return `PKR ${num.toLocaleString('en-PK')}`;
};

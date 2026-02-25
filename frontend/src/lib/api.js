import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function login(email, password) {
  return api.post('/auth/login', { email, password });
}

export function register(payload) {
  return api.post('/auth/register', payload);
}

export function fetchCurrentUser() {
  return api.get('/users/me');
}

export function fetchFreelancers() {
  return api.get('/users/freelancers');
}

export function fetchTransactions() {
  return api.get('/payments');
}

export function updateProfile(payload) {
  return api.put('/users/me/profile', payload);
}

export function getQuote({ amount, currency, targetCurrency }) {
  return api.post('/payments/quote', { amount, currency, targetCurrency });
}

export function createPayment({ freelancerId, amount, currency, mpesaNumber }) {
  return api.post('/payments', { freelancerId, amount, currency, mpesaNumber });
}

export default api;


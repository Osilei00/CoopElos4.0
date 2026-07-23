import axios from 'axios';

// All requests go through Next.js API Routes (proxy pattern)
// Frontend → Next.js API Routes → NestJS Backend
const api = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

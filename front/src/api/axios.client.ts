import axios from 'axios';

// Création de l'instance avec la Base URL
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter le token JWT automatiquement
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('audiophile_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
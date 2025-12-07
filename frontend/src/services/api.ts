import axios from 'axios';
import type { Item, ItemCreate, DeleteResponse } from '../types';

// Для разработки - через Vite прокси
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Логирование запросов для отладки
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

export const itemsApi = {
  getAll: () => api.get<Item[]>('/items/'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  create: (data: ItemCreate) => api.post<Item>('/items/', data),
  update: (id: number, data: ItemCreate) => api.put<Item>(`/items/${id}`, data),
  delete: (id: number) => api.delete<DeleteResponse>(`/items/${id}`),
};

// Force reload
console.log('API updated with trailing slashes');

export default api;

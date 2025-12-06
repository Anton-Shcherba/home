import axios from 'axios';
import type { Item, ItemCreate, DeleteResponse } from '../types';

// Для разработки - прокси через Vite
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itemsApi = {
  getAll: () => api.get<Item[]>('/items'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  create: (data: ItemCreate) => api.post<Item>('/items', data),
  update: (id: number, data: ItemCreate) => api.put<Item>(`/items/${id}`, data),
  delete: (id: number) => api.delete<DeleteResponse>(`/items/${id}`),
};

export default api;
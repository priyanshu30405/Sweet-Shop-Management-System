import axios from 'axios';
import { AuthResponse, RegisterDTO, LoginDTO, Sweet, CreateSweetDTO, UpdateSweetDTO } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  }
};

// Sweets API
export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets');
    return response.data;
  },

  search: async (filters: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets/search', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<Sweet> => {
    const response = await api.get<Sweet>(`/sweets/${id}`);
    return response.data;
  },

  create: async (data: CreateSweetDTO): Promise<Sweet> => {
    const response = await api.post<Sweet>('/sweets', data);
    return response.data;
  },

  update: async (id: number, data: UpdateSweetDTO): Promise<Sweet> => {
    const response = await api.put<Sweet>(`/sweets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },

  purchase: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post<Sweet>(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  restock: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post<Sweet>(`/sweets/${id}/restock`, { quantity });
    return response.data;
  }
};

export default api;













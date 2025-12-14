export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateSweetDTO {
  name: string;
  category: string;
  price: number;
  quantity?: number;
}

export interface UpdateSweetDTO {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}













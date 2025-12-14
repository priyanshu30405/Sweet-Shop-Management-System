export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
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

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: number;
  email: string;
  role: string;
}













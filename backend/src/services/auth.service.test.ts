import { register, login } from './auth.service';
import pool from '../config/database';
import bcrypt from 'bcryptjs';

jest.mock('../config/database');
jest.mock('bcryptjs');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rowCount: 0 }) // Email check - not exists
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            email: mockUser.email,
            name: mockUser.name,
            role: 'user',
            created_at: new Date()
          }]
        });

      (pool.query as jest.Mock) = mockQuery;
      (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashed_password');

      const result = await register(mockUser);

      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.name).toBe(mockUser.name);
      expect(result.token).toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
    });

    it('should throw error if email already exists', async () => {
      const mockUser = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({ rowCount: 1 }); // Email exists

      (pool.query as jest.Mock) = mockQuery;

      await expect(register(mockUser)).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = await bcrypt.hash('password123', 10);

      const mockQuery = jest.fn().mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: mockUser.email,
          password: hashedPassword,
          name: 'Test User',
          role: 'user',
          created_at: new Date()
        }]
      });

      (pool.query as jest.Mock) = mockQuery;
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

      const result = await login(mockUser);

      expect(result.user.email).toBe(mockUser.email);
      expect(result.token).toBeDefined();
    });

    it('should throw error if user not found', async () => {
      const mockUser = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [] });

      (pool.query as jest.Mock) = mockQuery;

      await expect(login(mockUser)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      const mockQuery = jest.fn().mockResolvedValueOnce({
        rows: [{
          id: 1,
          email: mockUser.email,
          password: hashedPassword,
          name: 'Test User',
          role: 'user',
          created_at: new Date()
        }]
      });

      (pool.query as jest.Mock) = mockQuery;
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);

      await expect(login(mockUser)).rejects.toThrow('Invalid credentials');
    });
  });
});













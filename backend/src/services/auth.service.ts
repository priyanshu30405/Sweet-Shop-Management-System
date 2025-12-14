import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RegisterDTO, LoginDTO, User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export const register = async (userData: RegisterDTO) => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const result = await pool.query(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
    [email, hashedPassword, name, 'user']
  );

  const user: User = result.rows[0];

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};

export const login = async (credentials: LoginDTO) => {
  const { email, password } = credentials;

  // Find user
  const result = await pool.query(
    'SELECT id, email, password, name, role, created_at FROM users WHERE email = $1',
    [email]
  );

  if (!result.rows || result.rows.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user: User = result.rows[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};













import pool from '../config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin User';

  try {
    // Check if admin already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existing.rowCount && existing.rowCount > 0) {
      console.log('Admin user already exists with this email');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashedPassword, name, 'admin']
    );

    console.log('Admin user created successfully:');
    console.log(result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();













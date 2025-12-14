import pool from '../config/database';
import { CreateSweetDTO, UpdateSweetDTO, Sweet } from '../types';

export const createSweet = async (sweetData: CreateSweetDTO): Promise<Sweet> => {
  const { name, category, price, quantity = 0 } = sweetData;

  const result = await pool.query(
    `INSERT INTO sweets (name, category, price, quantity) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, name, category, price, quantity, created_at, updated_at`,
    [name, category, price, quantity]
  );

  return result.rows[0];
};

export const getAllSweets = async (): Promise<Sweet[]> => {
  const result = await pool.query(
    'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets ORDER BY created_at DESC'
  );

  return result.rows;
};

export const getSweetById = async (id: number): Promise<Sweet> => {
  const result = await pool.query(
    'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets WHERE id = $1',
    [id]
  );

  if (!result.rows || result.rows.length === 0) {
    throw new Error('Sweet not found');
  }

  return result.rows[0];
};

export const updateSweet = async (id: number, updateData: UpdateSweetDTO): Promise<Sweet> => {
  // Check if sweet exists
  const existing = await pool.query('SELECT id FROM sweets WHERE id = $1', [id]);
  if (!existing.rows || existing.rows.length === 0) {
    throw new Error('Sweet not found');
  }

  // Build update query dynamically
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updateData.name !== undefined) {
    fields.push(`name = $${paramIndex++}`);
    values.push(updateData.name);
  }
  if (updateData.category !== undefined) {
    fields.push(`category = $${paramIndex++}`);
    values.push(updateData.category);
  }
  if (updateData.price !== undefined) {
    fields.push(`price = $${paramIndex++}`);
    values.push(updateData.price);
  }
  if (updateData.quantity !== undefined) {
    fields.push(`quantity = $${paramIndex++}`);
    values.push(updateData.quantity);
  }

  if (fields.length === 0) {
    return getSweetById(id);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await pool.query(
    `UPDATE sweets SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} 
     RETURNING id, name, category, price, quantity, created_at, updated_at`,
    values
  );

  return result.rows[0];
};

export const deleteSweet = async (id: number): Promise<void> => {
  const result = await pool.query('DELETE FROM sweets WHERE id = $1', [id]);

  if (!result.rowCount || result.rowCount === 0) {
    throw new Error('Sweet not found');
  }
};

export const purchaseSweet = async (id: number, quantity: number): Promise<Sweet> => {
  // Get current quantity
  const current = await pool.query('SELECT id, quantity FROM sweets WHERE id = $1', [id]);

  if (!current.rows || current.rows.length === 0) {
    throw new Error('Sweet not found');
  }

  const currentQuantity = current.rows[0].quantity;

  if (currentQuantity < quantity) {
    throw new Error('Insufficient quantity');
  }

  // Update quantity
  const result = await pool.query(
    `UPDATE sweets SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING id, name, category, price, quantity, created_at, updated_at`,
    [quantity, id]
  );

  return result.rows[0];
};

export const restockSweet = async (id: number, quantity: number): Promise<Sweet> => {
  // Check if sweet exists
  const existing = await pool.query('SELECT id, quantity FROM sweets WHERE id = $1', [id]);
  if (!existing.rows || existing.rows.length === 0) {
    throw new Error('Sweet not found');
  }

  // Update quantity
  const result = await pool.query(
    `UPDATE sweets SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING id, name, category, price, quantity, created_at, updated_at`,
    [quantity, id]
  );

  return result.rows[0];
};

export const searchSweets = async (filters: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Sweet[]> => {
  let query = 'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets WHERE 1=1';
  const values: any[] = [];
  let paramIndex = 1;

  if (filters.name) {
    query += ` AND name ILIKE $${paramIndex++}`;
    values.push(`%${filters.name}%`);
  }

  if (filters.category) {
    query += ` AND category ILIKE $${paramIndex++}`;
    values.push(`%${filters.category}%`);
  }

  if (filters.minPrice !== undefined) {
    query += ` AND price >= $${paramIndex++}`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query += ` AND price <= $${paramIndex++}`;
    values.push(filters.maxPrice);
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, values);
  return result.rows;
};


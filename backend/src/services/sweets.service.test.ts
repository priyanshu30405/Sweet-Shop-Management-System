import {
  createSweet,
  getAllSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  searchSweets
} from './sweets.service';
import pool from '../config/database';

jest.mock('../config/database');

describe('Sweets Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSweet', () => {
    it('should create a new sweet successfully', async () => {
      const mockSweet = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 50.00,
        quantity: 100
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({
        rows: [{
          id: 1,
          ...mockSweet,
          created_at: new Date(),
          updated_at: new Date()
        }]
      });

      (pool.query as jest.Mock) = mockQuery;

      const result = await createSweet(mockSweet);

      expect(result.name).toBe(mockSweet.name);
      expect(result.category).toBe(mockSweet.category);
      expect(result.price).toBe(mockSweet.price);
      expect(result.quantity).toBe(mockSweet.quantity);
    });

    it('should create sweet with default quantity 0 if not provided', async () => {
      const mockSweet = {
        name: 'Lollipop',
        category: 'Candy',
        price: 10.00
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({
        rows: [{
          id: 1,
          ...mockSweet,
          quantity: 0,
          created_at: new Date(),
          updated_at: new Date()
        }]
      });

      (pool.query as jest.Mock) = mockQuery;

      const result = await createSweet(mockSweet);

      expect(result.quantity).toBe(0);
    });
  });

  describe('getAllSweets', () => {
    it('should return all sweets', async () => {
      const mockSweets = [
        { id: 1, name: 'Sweet 1', category: 'Category 1', price: 10, quantity: 5, created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Sweet 2', category: 'Category 2', price: 20, quantity: 10, created_at: new Date(), updated_at: new Date() }
      ];

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: mockSweets });
      (pool.query as jest.Mock) = mockQuery;

      const result = await getAllSweets();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Sweet 1');
    });
  });

  describe('getSweetById', () => {
    it('should return sweet by id', async () => {
      const mockSweet = {
        id: 1,
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 50,
        quantity: 100,
        created_at: new Date(),
        updated_at: new Date()
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [mockSweet] });
      (pool.query as jest.Mock) = mockQuery;

      const result = await getSweetById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Chocolate Bar');
    });

    it('should throw error if sweet not found', async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [] });
      (pool.query as jest.Mock) = mockQuery;

      await expect(getSweetById(999)).rejects.toThrow('Sweet not found');
    });
  });

  describe('updateSweet', () => {
    it('should update sweet successfully', async () => {
      const updateData = { name: 'Updated Name', price: 75 };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Check exists
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'Updated Name',
            category: 'Chocolate',
            price: 75,
            quantity: 100,
            created_at: new Date(),
            updated_at: new Date()
          }]
        });

      (pool.query as jest.Mock) = mockQuery;

      const result = await updateSweet(1, updateData);

      expect(result.name).toBe('Updated Name');
      expect(result.price).toBe(75);
    });

    it('should throw error if sweet not found', async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [] });
      (pool.query as jest.Mock) = mockQuery;

      await expect(updateSweet(999, { name: 'New Name' })).rejects.toThrow('Sweet not found');
    });
  });

  describe('deleteSweet', () => {
    it('should delete sweet successfully', async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce({ rowCount: 1 });
      (pool.query as jest.Mock) = mockQuery;

      await deleteSweet(1);

      expect(mockQuery).toHaveBeenCalled();
    });

    it('should throw error if sweet not found', async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce({ rowCount: 0 });
      (pool.query as jest.Mock) = mockQuery;

      await expect(deleteSweet(999)).rejects.toThrow('Sweet not found');
    });
  });

  describe('purchaseSweet', () => {
    it('should decrease sweet quantity on purchase', async () => {
      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [{ id: 1, quantity: 100 }] })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'Chocolate Bar',
            category: 'Chocolate',
            price: 50,
            quantity: 95,
            created_at: new Date(),
            updated_at: new Date()
          }]
        });

      (pool.query as jest.Mock) = mockQuery;

      const result = await purchaseSweet(1, 5);

      expect(result.quantity).toBe(95);
    });

    it('should throw error if insufficient quantity', async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [{ id: 1, quantity: 5 }] });
      (pool.query as jest.Mock) = mockQuery;

      await expect(purchaseSweet(1, 10)).rejects.toThrow('Insufficient quantity');
    });
  });

  describe('restockSweet', () => {
    it('should increase sweet quantity on restock', async () => {
      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [{ id: 1, quantity: 100 }] })
        .mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'Chocolate Bar',
            category: 'Chocolate',
            price: 50,
            quantity: 150,
            created_at: new Date(),
            updated_at: new Date()
          }]
        });

      (pool.query as jest.Mock) = mockQuery;

      const result = await restockSweet(1, 50);

      expect(result.quantity).toBe(150);
    });
  });

  describe('searchSweets', () => {
    it('should search sweets by name', async () => {
      const mockSweets = [
        { id: 1, name: 'Chocolate Bar', category: 'Chocolate', price: 50, quantity: 100, created_at: new Date(), updated_at: new Date() }
      ];

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: mockSweets });
      (pool.query as jest.Mock) = mockQuery;

      const result = await searchSweets({ name: 'Chocolate' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Chocolate');
    });
  });
});













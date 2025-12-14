import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import {
  createSweet,
  getAllSweets,
  getSweetById,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  searchSweets
} from '../services/sweets.service';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create sweet (Admin only)
router.post(
  '/',
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sweet = await createSweet(req.body);
      res.status(201).json(sweet);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await getAllSweets();
    res.json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search sweets
router.get('/search', async (req, res) => {
  try {
    const filters: any = {};
    
    if (req.query.name) filters.name = req.query.name as string;
    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);

    const sweets = await searchSweets(filters);
    res.json(sweets);
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sweet by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const sweet = await getSweetById(id);
    res.json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update sweet
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid sweet ID' });
      }

      const sweet = await updateSweet(id, req.body);
      res.json(sweet);
    } catch (error: any) {
      if (error.message === 'Sweet not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete sweet (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    await deleteSweet(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Purchase sweet
router.post('/:id/purchase', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const sweet = await purchaseSweet(id, quantity);
    res.json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Insufficient quantity') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Restock sweet (Admin only)
router.post('/:id/restock', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid sweet ID' });
    }

    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const sweet = await restockSweet(id, quantity);
    res.json(sweet);
  } catch (error: any) {
    if (error.message === 'Sweet not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;













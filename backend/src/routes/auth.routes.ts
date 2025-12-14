import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../services/auth.service';

const router = express.Router();

// Register endpoint
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await login(req.body);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;













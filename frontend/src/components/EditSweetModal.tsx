import React, { useState, useEffect } from 'react';
import { Sweet } from '../types';
import { sweetsAPI } from '../services/api';
import './Modal.css';

interface EditSweetModalProps {
  sweet: Sweet;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSweetModal: React.FC<EditSweetModalProps> = ({ sweet, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price.toString(),
    quantity: sweet.quantity.toString()
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString()
    });
  }, [sweet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sweetsAPI.update(sweet.id, {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update sweet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Sweet</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Price (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Updating...' : 'Update Sweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSweetModal;













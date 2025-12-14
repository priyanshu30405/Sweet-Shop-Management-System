import React, { useState } from 'react';
import { sweetsAPI } from '../services/api';
import './Modal.css';

interface AddSweetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddSweetModal: React.FC<AddSweetModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '0'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sweetsAPI.create({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add sweet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Sweet</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Sweet Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Chocolate Truffle"
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="e.g., Chocolates"
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
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label>Initial Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="0"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Adding Sweet...' : 'Add Sweet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSweetModal;













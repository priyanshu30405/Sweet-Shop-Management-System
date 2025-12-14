import React, { useState } from 'react';
import { Sweet } from '../types';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: number, quantity: number) => void;
  onDelete: (id: number) => void;
  onEdit: (sweet: Sweet) => void;
  onRestock: (id: number, quantity: number) => void;
  isAdmin: boolean;
}

const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onPurchase,
  onDelete,
  onEdit,
  onRestock,
  isAdmin
}) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [showRestock, setShowRestock] = useState(false);

  const handlePurchase = () => {
    if (sweet.quantity > 0) {
      onPurchase(sweet.id, purchaseQuantity);
      setPurchaseQuantity(1);
    }
  };

  const handleRestock = () => {
    if (restockQuantity > 0) {
      onRestock(sweet.id, restockQuantity);
      setRestockQuantity(10);
      setShowRestock(false);
    }
  };

  return (
    <div className="sweet-card">
      <div className="sweet-card-header">
        <h3>{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
      </div>
      <div className="sweet-card-body">
        <div className="sweet-price">₹{Number(sweet.price).toFixed(2)}</div>
        <div className={`sweet-quantity ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
          {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} in stock`}
        </div>
      </div>
      <div className="sweet-card-actions">
        {!isAdmin && (
          <div className="purchase-section">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantity-input"
              disabled={sweet.quantity === 0}
            />
            <button
              onClick={handlePurchase}
              disabled={sweet.quantity === 0}
              className="purchase-button"
            >
              {sweet.quantity === 0 ? 'Sold Out' : 'Purchase'}
            </button>
          </div>
        )}
        {isAdmin && (
          <div className="admin-actions">
            <button onClick={() => onEdit(sweet)} className="edit-button">
              Edit
            </button>
            <button onClick={() => onDelete(sweet.id)} className="delete-button">
              Delete
            </button>
            {!showRestock ? (
              <button onClick={() => setShowRestock(true)} className="restock-button">
                Restock
              </button>
            ) : (
              <div className="restock-section">
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button onClick={handleRestock} className="confirm-restock-button">
                  ✓
                </button>
                <button onClick={() => setShowRestock(false)} className="cancel-button">
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SweetCard;













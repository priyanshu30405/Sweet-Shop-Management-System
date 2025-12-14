import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sweet } from '../types';
import { sweetsAPI } from '../services/api';
import SweetCard from '../components/SweetCard';
import SearchBar from '../components/SearchBar';
import AddSweetModal from '../components/AddSweetModal';
import EditSweetModal from '../components/EditSweetModal';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadSweets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sweets, searchFilters]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsAPI.getAll();
      if (Array.isArray(data)) {
        setSweets(data);
        setFilteredSweets(data);
      } else {
        console.error('API returned non-array data:', data);
        setSweets([]);
        setFilteredSweets([]);
        setError('Received invalid data from server.');
      }
    } catch (err: any) {
      setError('Failed to load sweets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const filters: any = {};
      if (searchFilters.name) filters.name = searchFilters.name;
      if (searchFilters.category) filters.category = searchFilters.category;
      if (searchFilters.minPrice) filters.minPrice = parseFloat(searchFilters.minPrice);
      if (searchFilters.maxPrice) filters.maxPrice = parseFloat(searchFilters.maxPrice);

      if (Object.keys(filters).length > 0) {
        const data = await sweetsAPI.search(filters);
        setFilteredSweets(data);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handlePurchase = async (id: number, quantity: number = 1) => {
    try {
      await sweetsAPI.purchase(id, quantity);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }
    try {
      await sweetsAPI.delete(id);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleRestock = async (id: number, quantity: number) => {
    try {
      await sweetsAPI.restock(id, quantity);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Restock failed');
    }
  };

  const handleAddSweet = async () => {
    setShowAddModal(false);
    await loadSweets();
  };

  const handleEditSweet = async () => {
    setEditingSweet(null);
    await loadSweets();
  };

  return (
    <div className="dashboard fade-in">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍬 Sweet Shop</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user?.name} {isAdmin && '(Admin)'}</span>
            <button onClick={logout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <SearchBar
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            categories={Array.from(new Set(sweets.map(s => s.category)))}
          />
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="add-button">
              <span>+</span> Add New Sweet
            </button>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading delicious sweets...
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="empty-state">
            <p>No sweets found matching your criteria.</p>
            {isAdmin && <p>Add some sweets to get started!</p>}
          </div>
        ) : (
          <div className="sweets-grid">
            {filteredSweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onDelete={handleDelete}
                onEdit={setEditingSweet}
                onRestock={handleRestock}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSweet}
        />
      )}

      {editingSweet && (
        <EditSweetModal
          sweet={editingSweet}
          onClose={() => setEditingSweet(null)}
          onSuccess={handleEditSweet}
        />
      )}
    </div>
  );
};

export default Dashboard;













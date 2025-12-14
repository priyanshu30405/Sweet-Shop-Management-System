import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  filters: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  };
  onFiltersChange: (filters: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
  categories: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, categories }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFiltersChange({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="search-bar">
      <div className="search-input-group">
        <input
          type="text"
          name="name"
          placeholder="Search sweets..."
          value={filters.name}
          onChange={handleChange}
        />
      </div>

      <div className="search-input-group">
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="search-input-group price-inputs">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          min="0"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          min="0"
        />
      </div>

      {(filters.name || filters.category || filters.minPrice || filters.maxPrice) && (
        <button onClick={clearFilters} className="clear-filters-button">
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchBar;













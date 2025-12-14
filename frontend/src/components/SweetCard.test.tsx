import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SweetCard from './SweetCard';
import { Sweet } from '../types';

describe('SweetCard', () => {
    const mockSweet: Sweet = {
        id: 1,
        name: 'Test Sweet',
        category: 'Test Category',
        price: 100,
        quantity: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const mockProps = {
        sweet: mockSweet,
        onPurchase: vi.fn(),
        onDelete: vi.fn(),
        onEdit: vi.fn(),
        onRestock: vi.fn(),
        isAdmin: false
    };

    it('renders sweet details correctly', () => {
        render(<SweetCard {...mockProps} />);
        expect(screen.getByText('Test Sweet')).toBeInTheDocument();
        expect(screen.getByText('Test Category')).toBeInTheDocument();
        expect(screen.getByText('₹100.00')).toBeInTheDocument();
        expect(screen.getByText('5 in stock')).toBeInTheDocument();
    });

    it('calls onPurchase when purchase button is clicked', () => {
        render(<SweetCard {...mockProps} />);
        const button = screen.getByText('Purchase');
        fireEvent.click(button);
        expect(mockProps.onPurchase).toHaveBeenCalledWith(1, 1);
    });

    it('displays "Out of Stock" when quantity is 0', () => {
        render(<SweetCard {...mockProps} sweet={{ ...mockSweet, quantity: 0 }} />);
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        expect(screen.getByText('Sold Out')).toBeDisabled();
    });

    it('shows admin buttons only when isAdmin is true', () => {
        render(<SweetCard {...mockProps} isAdmin={true} />);
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
        expect(screen.getByText('Restock')).toBeInTheDocument();
        expect(screen.queryByText('Purchase')).not.toBeInTheDocument();
    });
});

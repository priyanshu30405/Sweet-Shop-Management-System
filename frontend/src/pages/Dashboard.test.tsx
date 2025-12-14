import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { sweetsAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
    sweetsAPI: {
        getAll: vi.fn(),
        search: vi.fn()
    }
}));

// Mock useAuth
const mockUser = { id: 1, name: 'Test User', email: 'test@example.com', role: 'user' };
vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            user: mockUser,
            logout: vi.fn(),
            isAdmin: false
        }),
        AuthProvider: ({ children }: any) => <div>{children}</div>
    };
});

describe('Dashboard', () => {
    const renderDashboard = () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (sweetsAPI.getAll as any).mockImplementation(() => new Promise(() => { })); // Never resolves
        renderDashboard();
        expect(screen.getByText(/Loading delicious sweets/i)).toBeInTheDocument();
    });

    it('renders sweets after loading', async () => {
        const mockSweets = [
            { id: 1, name: 'Ladoo', category: 'Traditional', price: 50, quantity: 10 }
        ];
        (sweetsAPI.getAll as any).mockResolvedValue(mockSweets);

        renderDashboard();

        await waitFor(() => {
            expect(screen.getByText('Ladoo')).toBeInTheDocument();
        });
    });

    it('renders error message on api failure', async () => {
        (sweetsAPI.getAll as any).mockRejectedValue(new Error('Failed to fetch'));

        renderDashboard();

        await waitFor(() => {
            expect(screen.getByText(/Failed to load sweets/i)).toBeInTheDocument();
        });
    });

    it('renders empty state when no sweets found', async () => {
        (sweetsAPI.getAll as any).mockResolvedValue([]);

        renderDashboard();

        await waitFor(() => {
            expect(screen.getByText(/No sweets found matching your criteria/i)).toBeInTheDocument();
        });
    });
});

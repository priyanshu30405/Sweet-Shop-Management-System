import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const sweets = [
    {
        name: 'Gulaab Jamun',
        category: 'Traditional',
        price: 50.00,
        quantity: 100
    },
    {
        name: 'Kaju Katli',
        category: 'Premium',
        price: 800.00,
        quantity: 50
    },
    {
        name: 'Rasgulla',
        category: 'Traditional',
        price: 40.00,
        quantity: 80
    },
    {
        name: 'Mysore Pak',
        category: 'Regional',
        price: 400.00,
        quantity: 60
    },
    {
        name: 'Jalebi',
        category: 'Traditional',
        price: 200.00,
        quantity: 40
    },
    {
        name: 'Barfi',
        category: 'Milk Sweets',
        price: 350.00,
        quantity: 70
    }
];

const seedSweets = async () => {
    try {
        console.log('Seeding sweets...');

        // Clear existing sweets
        await pool.query('DELETE FROM sweets');
        console.log('Cleared existing sweets');

        for (const sweet of sweets) {
            await pool.query(
                'INSERT INTO sweets (name, category, price, quantity) VALUES ($1, $2, $3, $4)',
                [sweet.name, sweet.category, sweet.price, sweet.quantity]
            );
            console.log(`Added ${sweet.name}`);
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding sweets:', error);
        process.exit(1);
    }
};

seedSweets();

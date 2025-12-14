# Quick Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+ (or SQLite for development)

## Quick Start

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
DATABASE_URL=postgresql://postgres:password@localhost:5432/sweet_shop
EOF

# Create database (PostgreSQL)
createdb sweet_shop
# OR using psql:
# psql -U postgres -c "CREATE DATABASE sweet_shop;"

# Start server (will auto-create tables)
npm run dev
```

### 2. Frontend Setup (2 minutes)

```bash
# From root, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### 4. Create Admin User (Optional)

```bash
# From backend directory
npm run create-admin admin@example.com admin123 "Admin User"
```

Then login with these credentials to access admin features.

## Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Using SQLite Instead of PostgreSQL

If you prefer SQLite for local development:

1. Install `better-sqlite3` or `sqlite3` package
2. Modify `backend/src/config/database.ts` to use SQLite instead of pg
3. Update DATABASE_URL to `sqlite://./sweet_shop.db`

Note: The current implementation uses PostgreSQL. You'll need to adapt the database connection code for SQLite.

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists: `psql -l | grep sweet_shop`

### Port Already in Use

- Change PORT in backend/.env
- Update VITE_API_URL in frontend/.env accordingly

### Module Not Found Errors

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again













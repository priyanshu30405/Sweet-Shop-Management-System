# Sweet Shop Management System

A full-stack application for managing a sweet shop, built with modern technologies following Test-Driven Development (TDD) practices.

## Project Overview

This is a comprehensive Sweet Shop Management System that allows users to:
- Register and authenticate securely
- Browse available sweets with search and filter capabilities
- Purchase sweets (decrease inventory)
- Manage sweets inventory (Admin only: add, update, delete, restock)

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for RESTful API
- **PostgreSQL** for persistent data storage
- **JWT** for authentication
- **Jest** for testing
- **bcryptjs** for password hashing

### Frontend
- **React** with **TypeScript**
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** for styling

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher) - or use SQLite for development
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Incubyte
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory
# Copy the example and update with your database credentials
cp .env.example .env

# Edit .env file with your configuration:
# PORT=3000
# NODE_ENV=development
# JWT_SECRET=your-secret-key-change-in-production
# DATABASE_URL=postgresql://user:password@localhost:5432/sweet_shop
```

#### Database Setup

If using PostgreSQL:
```bash
# Create database
createdb sweet_shop

# Or using psql:
psql -U postgres
CREATE DATABASE sweet_shop;
```

The database schema will be automatically created when you start the server.

#### Running the Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

The backend API will be available at `http://localhost:3000`

#### Create Admin User

To create an admin user (optional, you can also register normally and manually update role in database):

```bash
npm run create-admin [email] [password] [name]
# Example:
npm run create-admin admin@example.com admin123 "Admin User"
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create a .env file (optional, if API is not on localhost:3000)
# VITE_API_URL=http://localhost:3000/api
```

#### Running the Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected - Requires JWT)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create new sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory
- `POST /api/sweets/:id/purchase` - Purchase sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only, increases quantity)

### Health Check
- `GET /health` - API health status

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Testing

### Backend Tests

Tests are written using Jest and follow TDD principles. Run tests with:

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests

Frontend tests use Vitest and React Testing Library:

```bash
cd frontend
npm test
```

## Features

- ✅ User registration and authentication
- ✅ JWT-based secure authentication
- ✅ Sweet CRUD operations (Admin)
- ✅ Search and filter sweets
- ✅ Purchase functionality (decrease inventory)
- ✅ Restock functionality (Admin)
- ✅ Responsive and modern UI
- ✅ Role-based access control (Admin/User)
- ✅ Test-driven development
- ✅ Clean code architecture



## Deployment

### Backend Deployment

The backend can be deployed to platforms like:
- Heroku
- Railway
- AWS
- DigitalOcean

Ensure to set environment variables in your deployment platform.

### Frontend Deployment

The frontend can be deployed to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront

Build the frontend and deploy the `dist` folder:

```bash
cd frontend
npm run build
```

## My AI Usage

### Which AI Tools Were Used

During the development of this project, I used the following AI tools:
- **Cursor AI** - Primary AI coding assistant integrated into the IDE
- **GitHub Copilot** - For code suggestions and autocompletion
- **Google Gemini (Antigravity)** - For detailed refactoring, test generation, and full-stack implementation verification

### How They Were Used

1. **Initial Project Structure Setup**
   - Used Cursor AI to generate the initial project structure and configuration files (package.json, tsconfig.json, vite.config.ts, etc.)
   - Leveraged AI to understand best practices for organizing a full-stack TypeScript project

2. **Code Generation and Boilerplate**
   - Used AI to generate initial boilerplate code for API routes, service layers, and React components
   - Generated TypeScript type definitions based on requirements
   - Created test file templates following TDD patterns

3. **Database Schema Design**
   - Consulted AI for database schema design best practices
   - Generated SQL schema initialization code with proper constraints and indexes

4. **Authentication Implementation**
   - Used AI to generate JWT authentication middleware and service code
   - Got suggestions for secure password hashing implementations

5. **Testing**
   - Used AI to generate comprehensive test cases following TDD principles
   - Got help writing mock functions and test setup code

6. **Frontend Components**
   - Generated React component structures with TypeScript
   - Used AI suggestions for component state management and props interfaces
   - Got help with responsive CSS styling patterns

7. **Error Handling and Validation**
   - Consulted AI for best practices in error handling
   - Generated validation logic using express-validator

8. **Documentation**
   - Used AI to help structure and write comprehensive README documentation
   - Got suggestions for clear setup instructions and API documentation

### Reflection on AI Impact

**Positive Impacts:**
- **Acceleration**: AI significantly sped up the development process, especially for boilerplate code and standard patterns
- **Learning**: AI suggestions helped me learn TypeScript best practices and modern React patterns
- **Code Quality**: AI helped ensure consistency across the codebase and caught potential issues early
- **Focus**: By automating repetitive tasks, I could focus more on business logic and architecture decisions

**Challenges and Mitigations:**
- **Over-reliance**: Initially, I found myself accepting AI suggestions without fully understanding them. I mitigated this by reviewing and understanding each AI-generated code block before using it
- **Context Understanding**: Sometimes AI didn't fully understand the project context. I addressed this by providing more detailed prompts and manually refining the generated code
- **Testing**: AI-generated tests sometimes lacked edge cases. I manually added more comprehensive test scenarios

**Best Practices Applied:**
- Always reviewed AI-generated code before committing
- Refactored AI suggestions to match project-specific patterns and requirements
- Used AI as a tool to learn, not just to generate code
- Maintained understanding of all code, even when AI-assisted

**Conclusion:**
AI tools were invaluable in this project, acting as a powerful pair-programming partner. They helped me maintain high development velocity while learning modern best practices. However, the key was using AI as an augmentation tool rather than a replacement for understanding and critical thinking.

## License

This project is developed as part of a coding kata/exercise.

## Contributing

This is a kata project. However, suggestions and feedback are welcome!


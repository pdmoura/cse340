# CSE Motors - Vehicle Inventory Management System

A full-stack Node.js web application for managing vehicle inventory, user accounts, and customer reviews. Built as a CSE 340 course project with Express.js, EJS templating, and PostgreSQL database.

## Features

- **Vehicle Inventory Management**: Browse, search, and manage vehicle inventory
- **User Authentication**: Secure account registration and login with JWT tokens
- **Review System**: Customer reviews and ratings for vehicles
- **Responsive Design**: Modern UI with EJS templates and CSS styling
- **Database Integration**: PostgreSQL database for persistent data storage
- **Session Management**: Secure user sessions with PostgreSQL session store

## Technology Stack

- **Backend**: Node.js with Express.js framework
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens and bcrypt for password hashing
- **Templating**: EJS with Express layouts
- **Session Store**: connect-pg-simple for PostgreSQL-based sessions
- **Package Manager**: PNPM for efficient dependency management

## Prerequisites

- Node.js (v14 or higher)
- PNPM package manager
- PostgreSQL database (or use provided cloud database)
- Git for version control

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd cse340
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Set up environment variables:
    - Copy `.env` file and configure your database connection
    - Update `DATABASE_URL` with your PostgreSQL connection string
    - Generate secure `SESSION_SECRET` and `ACCESS_TOKEN_SECRET`

4. Set up the database:
    - Run the SQL scripts in the `database/` directory
    - Execute `db-sql-code.sql` to create tables and initial data

## Running the Application

1. Start the development server:

    ```bash
    pnpm run dev
    ```

2. For production:

    ```bash
    pnpm start
    ```

3. Open your browser and navigate to: `http://localhost:5500`

## Project Structure

```
cse340/
├── controllers/          # Application logic and route handlers
├── database/            # Database configuration and SQL scripts
├── models/              # Data models and database interactions
├── routes/              # Express route definitions
├── utilities/           # Helper functions and middleware
├── views/               # EJS templates and views
│   ├── account/         # Account-related pages
│   ├── inventory/       # Inventory management pages
│   ├── review/          # Review system pages
│   ├── layouts/         # Page layouts
│   └── partials/        # Reusable template components
├── public/              # Static assets (CSS, images, JavaScript)
├── server.js            # Main application entry point
└── package.json         # Project dependencies and scripts
```

## Key Routes

- `/` - Home page with featured vehicles
- `/inv` - Vehicle inventory management
- `/account` - User registration, login, and profile management
- `/review` - Customer review system

## Environment Variables

The application uses the following environment variables (defined in `.env`):

- `PORT` - Server port (default: 5500)
- `HOST` - Server host (default: localhost)
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption
- `ACCESS_TOKEN_SECRET` - Secret for JWT token signing

## Database Schema

The application uses several key tables:

- `inventory` - Vehicle information
- `account` - User accounts
- `review` - Customer reviews
- `classification` - Vehicle categories

## Development Notes

- Uses `nodemon` for automatic server restarts during development
- Implements error handling with custom error pages
- Includes input validation and sanitization
- Features secure password hashing with bcrypt
- Implements JWT-based authentication for API routes

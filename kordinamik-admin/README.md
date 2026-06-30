# Kordinamik Admin Panel Backend

This is the backend for the Kordinamik Admin Panel, built with Node.js, Express, and PostgreSQL.

## Features

- Admin authentication with JWT (access + refresh tokens)
- Product management
- Category management
- Image storage in database
- Comprehensive audit logging
- Security best practices implementation

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd kordinamik-admin
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   # Server configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ADMIN_URL=http://localhost:3002

   # Database configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=kordinamik_admin
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   # JWT configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret_change_this_in_production
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this_in_production
   ACCESS_TOKEN_EXPIRY=30m
   REFRESH_TOKEN_EXPIRY=7d

   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

4. Create the PostgreSQL database:
   ```
   createdb kordinamik_admin
   ```

5. Initialize the database tables:
   ```
   node scripts/init-db.js
   ```

6. Create the initial admin user:
   ```
   node scripts/create-admin.js
   ```

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login admin
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout admin

### Admin Management

- `POST /api/admin` - Create a new admin
- `GET /api/admin` - Get all admins
- `GET /api/admin/:id` - Get admin by ID
- `PUT /api/admin/:id` - Update admin
- `DELETE /api/admin/:id` - Delete admin
- `POST /api/admin/change-password` - Change admin password

### Product Management

- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/images` - Upload product image
- `DELETE /api/products/:id/images/:imageId` - Delete product image

## Database Schema

The database includes the following tables:

- `admins` - Admin user information
- `categories` - Product categories
- `products` - Product information
- `product_images` - Product images stored as binary data
- `token_blacklist` - Revoked tokens
- `audit_logs` - System audit trail

## Security Features

- Password hashing with bcrypt
- JWT-based authentication with short-lived access tokens
- HTTP-only, secure cookies for refresh tokens
- Token blacklisting for revoked tokens
- Rate limiting for API endpoints
- Input validation
- Secure HTTP headers with Helmet
- Comprehensive audit logging

## Initial Setup

After setting up the database and running the initialization scripts, you'll have an admin user with the following credentials:

- Username: admin
- Password: Admin123!

**Important:** Change this password immediately after first login.

### Database Schema Initialization

The database schema is automatically created when you run the `init-db.js` script. This script:

1. Connects to your PostgreSQL database
2. Creates all required tables (admins, products, categories, product_images, etc.)
3. Sets up relationships between tables

If you need to reset the database at any point, you can run the initialization script again:

```
node scripts/init-db.js
```

**Warning:** This will drop all existing tables and data!

## License

[MIT](LICENSE)



# ResourceMan Global Server Storage

A Node.js/Express backend server with SQLite database for centralized data storage.

## Features

- **SQLite Database** - Lightweight, file-based database
- **RESTful API** - Complete CRUD operations
- **CORS Enabled** - Works with frontend applications
- **Centralized Storage** - All data in one place
- **Auto Table Creation** - Database tables created automatically

## Database Tables

1. **customers** - User accounts and profiles
2. **inquiries** - Customer inquiries/messages
3. **products** - Product catalog
4. **orders** - Purchase orders
5. **staff** - Employee/payroll data
6. **payroll_history** - Payroll records

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development Mode
```bash
npm start
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Save customers (bulk)
- `GET /api/customers/:email` - Get single customer
- `DELETE /api/customers/:email` - Delete customer

### Inquiries
- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Save inquiry

### Products/Catalog
- `GET /api/catalog` - Get all products (grouped by type)
- `POST /api/catalog` - Save catalog (bulk update)

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Save order
- `PUT /api/orders/:id` - Update order status

### Staff/Payroll
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff
- `DELETE /api/staff/:id` - Delete staff
- `GET /api/payroll-history` - Get payroll history
- `POST /api/payroll-history` - Save payroll entry

## Connecting Frontend

Update the frontend API configuration in `index.js`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : `https://${window.location.hostname}`;
```

## Database File

The SQLite database is stored in `resourceman.db` in the backend folder. This file is created automatically on first run.

## Deployment

### Option 1: Local Server
```bash
npm start
```

### Option 2: Cloud Hosting (Render, Railway, z.com, etc.)
1. Push the `backend` folder to GitHub
2. Connect your repository to the hosting service
3. Configure the following settings:
   - **Start Command:** `npm start`
   - **Port:** `3001` (or leave as default)
   - **Node Version:** 18+ (recommended)
4. Deploy the application

### Option 3: z.com Hosting
1. Upload the `backend` folder to your z.com hosting
2. Ensure Node.js is enabled on your hosting plan
3. Run `npm install` in the backend directory
4. Start the server with `npm start`
5. Configure your domain to point to the server port

### Option 4: PM2 (Production Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name resourceman-server

# Monitor
pm2 monit

# Stop
pm2 stop resourceman-server
```

## Environment Variables

- `PORT` - Server port (default: 3001)

## Dependencies

- **express** - Web server framework
- **cors** - Cross-origin resource sharing
- **sqlite3** - SQLite database driver

## Notes

- All data is stored in SQLite database file
- No external database required
- Automatic table creation on first run
- CORS enabled for all origins
- JSON request/response format
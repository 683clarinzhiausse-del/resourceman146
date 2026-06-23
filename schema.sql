-- Cloudflare D1 Database Schema for ResourceMan

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'client',
    phone TEXT,
    address TEXT,
    isBlocked INTEGER DEFAULT 0,
    purchaseHistory TEXT DEFAULT '[]',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    date TEXT,
    replied INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products/Catalog table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    type TEXT,
    name TEXT,
    price TEXT,
    image TEXT,
    desc TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerEmail TEXT,
    customerName TEXT,
    item TEXT,
    cost TEXT,
    payment TEXT,
    status TEXT DEFAULT 'Pending',
    deliveryDays INTEGER,
    deliveryDate TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Staff/Payroll table
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT,
    position TEXT,
    salary REAL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payroll history table
CREATE TABLE IF NOT EXISTS payroll_history (
    id TEXT PRIMARY KEY,
    date TEXT,
    count INTEGER,
    total TEXT,
    status TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customerEmail);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
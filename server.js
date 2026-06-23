const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory (frontend)
app.use(express.static('../'));

// Favicon handler - return empty response to prevent 404
app.get('/favicon.ico', (req, res) => {
    res.status(204).send();
});

// Initialize SQLite database
const db = new sqlite3.Database('./resourceman.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create tables
db.serialize(() => {
    // Customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
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
    )`);

    // Inquiries table
    db.run(`CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        date TEXT,
        replied INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products/Catalog table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        type TEXT,
        name TEXT,
        price TEXT,
        image TEXT,
        desc TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
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
    )`);

    // Staff/Payroll table
    db.run(`CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT,
        position TEXT,
        salary REAL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Payroll history table
    db.run(`CREATE TABLE IF NOT EXISTS payroll_history (
        id TEXT PRIMARY KEY,
        date TEXT,
        count INTEGER,
        total TEXT,
        status TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables created/verified');
});

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ResourceMan Server is running' });
});

// ==========================================
// CUSTOMERS ROUTES
// ==========================================

// Get all customers
app.get('/api/customers', (req, res) => {
    db.all('SELECT * FROM customers ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching customers:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        // Parse purchaseHistory from JSON string
        const customers = rows.map(customer => ({
            ...customer,
            purchaseHistory: JSON.parse(customer.purchaseHistory || '[]')
        }));
        res.json(customers);
    });
});

// Save customers (bulk sync)
app.post('/api/customers', (req, res) => {
    const customers = req.body;
    if (!Array.isArray(customers)) {
        res.status(400).json({ error: 'Invalid data format. Expected array.' });
        return;
    }

    const stmt = db.prepare(`INSERT OR REPLACE INTO customers 
        (id, name, email, password, role, phone, address, isBlocked, purchaseHistory) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    customers.forEach(customer => {
        stmt.run(
            customer.id,
            customer.name,
            customer.email,
            customer.password,
            customer.role || 'client',
            customer.phone || '',
            customer.address || '',
            customer.isBlocked ? 1 : 0,
            JSON.stringify(customer.purchaseHistory || [])
        );
    });

    stmt.finalize((err) => {
        if (err) {
            console.error('Error saving customers:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: 'Customers saved successfully' });
    });
});

// Get single customer
app.get('/api/customers/:email', (req, res) => {
    const email = req.params.email;
    db.get('SELECT * FROM customers WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error fetching customer:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }
        res.json({
            ...row,
            purchaseHistory: JSON.parse(row.purchaseHistory || '[]')
        });
    });
});

// Delete customer
app.delete('/api/customers/:email', (req, res) => {
    const email = req.params.email;
    db.run('DELETE FROM customers WHERE email = ?', [email], function(err) {
        if (err) {
            console.error('Error deleting customer:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }
        res.json({ success: true, message: 'Customer deleted' });
    });
});

// ==========================================
// INQUIRIES ROUTES
// ==========================================

// Get all inquiries
app.get('/api/inquiries', (req, res) => {
    db.all('SELECT * FROM inquiries ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching inquiries:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Save inquiry
app.post('/api/inquiries', (req, res) => {
    const inquiry = req.body;
    if (!inquiry.id || !inquiry.email) {
        res.status(400).json({ error: 'Invalid inquiry data' });
        return;
    }

    db.run(`INSERT OR REPLACE INTO inquiries 
        (id, name, email, subject, message, date, replied) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [inquiry.id, inquiry.name, inquiry.email, inquiry.subject, inquiry.message, inquiry.date, inquiry.replied ? 1 : 0],
        function(err) {
            if (err) {
                console.error('Error saving inquiry:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Inquiry saved' });
        }
    );
});

// ==========================================
// PRODUCTS/CATALOG ROUTES
// ==========================================

// Get all products
app.get('/api/catalog', (req, res) => {
    db.all('SELECT * FROM products ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching catalog:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Group by type
        const catalog = {
            shoes: rows.filter(p => p.type === 'shoe'),
            shoelanders: rows.filter(p => p.type === 'shoelander'),
            marikinaCollection: rows.filter(p => p.type === 'marikina'),
            techProducts: rows.filter(p => p.type === 'technology')
        };
        res.json(catalog);
    });
});

// Save catalog (bulk update)
app.post('/api/catalog', (req, res) => {
    const catalog = req.body;
    if (!catalog) {
        res.status(400).json({ error: 'Invalid catalog data' });
        return;
    }

    // Clear existing products
    db.run('DELETE FROM products', (err) => {
        if (err) {
            console.error('Error clearing catalog:', err);
            res.status(500).json({ error: err.message });
            return;
        }

        // Insert new products
        const stmt = db.prepare(`INSERT INTO products (id, type, name, price, image, desc) VALUES (?, ?, ?, ?, ?, ?)`);
        let count = 0;

        const allProducts = [
            ...(catalog.shoes || []).map(p => ({ ...p, type: 'shoe' })),
            ...(catalog.shoelanders || []).map(p => ({ ...p, type: 'shoelander' })),
            ...(catalog.marikinaCollection || []).map(p => ({ ...p, type: 'marikina' })),
            ...(catalog.techProducts || []).map(p => ({ ...p, type: 'technology' }))
        ];

        allProducts.forEach(product => {
            stmt.run(product.id, product.type, product.name, product.price, product.image, product.desc || '');
            count++;
        });

        stmt.finalize((err) => {
            if (err) {
                console.error('Error saving catalog:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: `Catalog updated with ${count} products` });
        });
    });
});

// ==========================================
// ORDERS ROUTES
// ==========================================

// Get all orders
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Save order
app.post('/api/orders', (req, res) => {
    const order = req.body;
    if (!order.id) {
        res.status(400).json({ error: 'Invalid order data' });
        return;
    }

    db.run(`INSERT OR REPLACE INTO orders 
        (id, customerEmail, customerName, item, cost, payment, status, deliveryDays, deliveryDate) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            order.id,
            order.customerEmail,
            order.customerName,
            order.item,
            order.cost,
            order.payment || 'N/A',
            order.status || 'Pending',
            order.deliveryDays || null,
            order.deliveryDate || null
        ],
        function(err) {
            if (err) {
                console.error('Error saving order:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Order saved' });
        }
    );
});

// Update order status
app.put('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const updates = req.body;
    
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(orderId);

    db.run(`UPDATE orders SET ${setClause} WHERE id = ?`, values, function(err) {
        if (err) {
            console.error('Error updating order:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json({ success: true, message: 'Order updated' });
    });
});

// ==========================================
// STAFF/PAYROLL ROUTES
// ==========================================

// Get all staff
app.get('/api/staff', (req, res) => {
    db.all('SELECT * FROM staff ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching staff:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add staff
app.post('/api/staff', (req, res) => {
    const staff = req.body;
    if (!staff.id || !staff.name) {
        res.status(400).json({ error: 'Invalid staff data' });
        return;
    }

    db.run(`INSERT OR REPLACE INTO staff (id, name, position, salary) VALUES (?, ?, ?, ?)`,
        [staff.id, staff.name, staff.position, staff.salary],
        function(err) {
            if (err) {
                console.error('Error saving staff:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Staff saved' });
        }
    );
});

// Delete staff
app.delete('/api/staff/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM staff WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting staff:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Staff not found' });
            return;
        }
        res.json({ success: true, message: 'Staff deleted' });
    });
});

// Get payroll history
app.get('/api/payroll-history', (req, res) => {
    db.all('SELECT * FROM payroll_history ORDER BY createdAt DESC', (err, rows) => {
        if (err) {
            console.error('Error fetching payroll history:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Save payroll history
app.post('/api/payroll-history', (req, res) => {
    const entry = req.body;
    if (!entry.id) {
        res.status(400).json({ error: 'Invalid payroll data' });
        return;
    }

    db.run(`INSERT OR REPLACE INTO payroll_history (id, date, count, total, status) VALUES (?, ?, ?, ?, ?)`,
        [entry.id, entry.date, entry.count, entry.total, entry.status],
        function(err) {
            if (err) {
                console.error('Error saving payroll history:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true, message: 'Payroll history saved' });
        }
    );
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, HOST, () => {
    console.log(`🚀 ResourceMan Server running on ${HOST}:${PORT}`);
    console.log(`📡 API endpoint: http://${HOST}:${PORT}/api`);
    console.log(`💾 Database: resourceman.db`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
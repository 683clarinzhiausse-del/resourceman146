const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:5500",
  "https://pcama.github.io"
];

// Enable debug logging by setting DEBUG=1 (or DEBUG=true) when running node server.js
const DEBUG = String(process.env.DEBUG || '').toLowerCase() === '1' || String(process.env.DEBUG || '').toLowerCase() === 'true';

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      if (DEBUG) console.warn('[cors] Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '2mb' }));

// Request logger (only noisy when DEBUG enabled)
app.use((req, res, next) => {
  if (!DEBUG) return next();

  const startedAt = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    const status = res.statusCode;
    console.log(`[http] ${method} ${originalUrl} -> ${status} (${ms}ms)`);
  });

  res.on('close', () => {
    // If client aborts before finish.
    if (!res.writableEnded) {
      const ms = Date.now() - startedAt;
      console.warn(`[http] ${method} ${originalUrl} -> aborted (${ms}ms)`);
    }
  });

  next();
});

// Memory-based storage for cross-device demo (resets on server restart)
let globalCatalog = {};
let globalCustomers = [];

// Payment Gateway Integration
app.use(require('./server-payment'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Sync Endpoints for r4.js
app.get('/api/catalog', (req, res) => res.json(globalCatalog));
app.post('/api/catalog', (req, res) => {
  globalCatalog = req.body;
  res.json({ success: true });
});

app.get('/api/customers', (req, res) => res.json(globalCustomers));
app.post('/api/customers', (req, res) => {
  globalCustomers = req.body;
  res.json({ success: true });
});

// Payroll API Placeholder
app.get('/api/payroll/summary', (req, res) => {
  // In a production environment, this would query a database
  // rather than relying on the client's localStorage.
  res.json({ 
    message: "Payroll system active. State managed by client.",
    owner_account: "Christopher Jose Nyuda Rodriguez",
    account_number: "014763572417",
    swift: "GOTYPHM2XXX"
  });
});

// System Reset Endpoint
app.delete('/api/admin/reset-demo', (req, res) => {
  // Placeholder for clearing server-side database records
  res.json({ ok: true, message: "Reset signal received. Client-side data should be cleared." });
});

// NOTE: This is a starter backend.
// Next steps will add endpoints to store/load:
// - customer registry (users)
// - admin metrics
// - purchase history
// - block/unblock

// AI endpoints moved to server-ai.js
require('./server-ai');

// Centralized error handler (always returns JSON)
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = Number(err.statusCode || err.status || 500);
  const safeMessage = err && err.message ? err.message : 'Internal Server Error';

  if (DEBUG) {
    console.error('Unhandled server error:', {
      message: safeMessage,
      status,
      stack: err && err.stack ? err.stack : undefined,
      path: req && req.originalUrl ? req.originalUrl : undefined,
      method: req && req.method ? req.method : undefined
    });
  }

  res.status(status).json({
    error: {
      message: safeMessage,
      status
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});


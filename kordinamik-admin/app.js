const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const dealerApplicationRoutes = require('./routes/dealer-application.routes');
const dealerRoutes = require('./routes/dealer.routes');
const publicRoutes = require('./routes/public.routes');
const dealerAdminRoutes = require('./routes/dealer-admin.routes');
const orderRoutes = require('./routes/order.routes');
const dealerOrderRoutes = require('./routes/dealer-order.routes');
const warrantyRoutes = require('./routes/warranty.routes');

// Import middleware
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Apply security middleware
app.use(helmet());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Parse cookies
app.use(cookieParser());

// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.GUARANTEE_URL,
  'https://guarantee.kordinamik.com',
  'https://garanti.kordinamik.com',
  'https://garanti.berkopasha.com',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3004',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3004',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Helper to return consistent JSON for rate-limit hits
const jsonRateLimiter = (options) =>
  rateLimit({
    ...options,
    handler: (_req, res) => {
      res.status(429).json({
        status: 'error',
        message: options.message || 'Too many requests, please try again later.'
      });
    }
  });

// Login rate limiting (more strict)
const loginLimiter = jsonRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
});
app.use('/api/auth/login', loginLimiter);

// Dealer login/register rate limiting to reduce brute-force on email/approval code
const dealerLoginLimiter = jsonRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many dealer login attempts, please try again later.'
});

const dealerRegisterLimiter = jsonRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many registration attempts, please try again later.'
});

app.use('/api/dealer/login', dealerLoginLimiter);
app.use('/api/dealer/register', dealerRegisterLimiter);

// Routes
app.use('/api/auth', authRoutes);
// Admin-specific dealers listing placed before generic /api/admin/:id routes to avoid conflicts
app.use('/api/admin/dealers', dealerAdminRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dealer-applications', dealerApplicationRoutes);
app.use('/api/dealer/orders', dealerOrderRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/warranty', warrantyRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;


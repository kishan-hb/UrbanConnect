const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const userRoutes = require('./routes/userroutes');
const serviceRoutes = require('./routes/serviceroutes');
const bookingRoutes = require('./routes/bookingroutes');
const reviewRoutes = require('./routes/reviewroutes');
const adminRoutes = require('./routes/adminroutes');
const providerRoutes = require('./routes/providerroutes');
const { clerkMiddleware } = require('@clerk/express');
const { requireAuthentication } = require('./middleware/auth');
const errorhandler = require('./middleware/errorhandler');
const aiRoutes = require('./routes/airoutes');
const app = express();
const { cleanEnv, str } = require('envalid');
cleanEnv(process.env, {
  CLERK_SECRET_KEY: str(),
  CLERK_PUBLISHABLE_KEY: str(),
  HUGGINGFACE_API_KEY: str(),
});
const logger = require('./logger');

app.use(cors());
app.use(express.json());
app.use('/api/ai', aiRoutes);
app.use(clerkMiddleware({ publishableKey: process.env.CLERK_PUBLISHABLE_KEY, secretKey: process.env.CLERK_SECRET_KEY }));
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/providers', providerRoutes);

app.get('/', (req, res) => {
  res.send('UrbanConnect API is running');
});

app.get('/api/auth-check', (req, res) => {
  res.json({
    auth: req.auth || null
  });
});
app.get('/api/protected-test', requireAuthentication, (req, res) => {
  res.json({
    message: 'You are authenticated',
    auth: req.auth
  });
});
app.get('/api/error-test', (req, res, next) => {
  next({ status: 400, message: 'Centralized error handler is working' });
});
app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorhandler);

let server; // <-- Store server instance

if (require.main === module) {
  mongoose.connect(config.mongoUri, {})
    .then(() => {
      logger.info('MongoDB connected');
      server = app.listen(config.port, () => logger.info(`Server running on port ${config.port}`));
    })
    .catch((err) => logger.error('MongoDB connection error:', err));
}

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutting down server...');
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = app;

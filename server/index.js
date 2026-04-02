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
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
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
    auth : req.auth || null
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

app.use(errorhandler);

if (require.main === module) {
  mongoose.connect(config.mongoUri, {})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

  app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
}

module.exports = app;

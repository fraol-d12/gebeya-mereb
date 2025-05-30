const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

const app = express();
dotenv.config();

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', listingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Import models (needed for sync)
const User = require('./models/User');
const Listing = require('./models/Listing');

// Start server after DB connection
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Test database connection with a simple query
    try {
      const testQuery = await sequelize.query('SELECT 1+1 AS result');
      console.log('✅ Database query test successful:', testQuery);
    } catch (queryErr) {
      console.error('❌ Database query test failed:', queryErr);
    }

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log('- GET /api/listings');
      console.log('- GET /api/listings/:id');
      console.log('- POST /api/listings');
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}

startServer();

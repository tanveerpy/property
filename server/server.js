const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const apiRouter = require('./api');
const { getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
try {
  getDb();
  console.log('Zero-config SQLite database successfully loaded & verified.');
} catch (err) {
  console.error('Failed to initialize database:', err);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API routes
app.use('/api', apiRouter);

// Serve static assets from public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve React production build if available
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If frontend not built yet, friendly welcome landing
  app.get('/', (req, res) => {
    res.json({
      name: 'Real Estate Management System API',
      status: 'Online',
      documentation: {
        properties: '/api/properties',
        agents: '/api/agents',
        buyers: '/api/buyers',
        sellers: '/api/sellers',
        transactions: '/api/transactions',
        analytics: '/api/analytics/stats',
        queries: '/api/queries?type=top_earners'
      }
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏡 Real Estate Management System running on port ${PORT}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🚀 Frontend URL: http://localhost:${PORT}`);
    console.log(`====================================================`);
  });
}

module.exports = app;

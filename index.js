// Main entry point for Real Estate Management System
const app = require('./server/server');

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🏡 ========================================================`);
    console.log(`   Real Estate Management System Server Active`);
    console.log(`   Local Server: http://localhost:${PORT}`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api`);
    console.log(`========================================================\n`);
  });
}

module.exports = app;

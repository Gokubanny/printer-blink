const app = require('./app');
const connectDB = require('./config/database');
const { port, nodeEnv } = require('./config/env');

// Connect to database
connectDB();

// Start server
const server = app.listen(port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🖨️  Hyperdist API Server                    ║
║                                                       ║
║   Server running in ${nodeEnv} mode                 ║
║   Port: ${port}                                      ║
║   URL: http://localhost:${port}                      ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;
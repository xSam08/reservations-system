import { createApp } from './app';
import { config } from './config';

const app = createApp();

// Start server
app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
  console.log(`API Documentation: http://localhost:${config.port}/api-docs`);
  console.log(`Health Check: http://localhost:${config.port}/health`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`JWT Secret: ${config.jwtSecret.substring(0, 10)}...`);
  console.log(`Rate Limit: ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs / 1000}s`);
  console.log('\nAvailable Services:');
  
  Object.entries(config.services).forEach(([name, url]) => {
    console.log(`  • ${name.padEnd(12)} → ${url}`);
  });
  
  console.log('\nAPI Endpoints:');
  console.log('  • GET  /health          - Gateway health check');
  console.log('  • GET  /api-docs        - Swagger documentation');
  console.log('  • POST /api/auth/login  - User authentication');
  console.log('  • POST /api/auth/register - User registration');
  console.log('  • GET  /api/users       - User management');
  console.log('  • GET  /api/hotels      - Hotel listings');
  console.log('  • POST /api/search      - Hotel search');
  console.log('  • GET  /api/availability - Room availability');
  console.log('  • GET  /api/reservations - User reservations');
  console.log('  • GET  /api/reviews     - Hotel reviews');
  console.log('  • GET  /api/notifications - User notifications');
  console.log('  • GET  /api/payments    - Payment processing');
  console.log('  • GET  /api/reports     - Analytics (Admin only)');
  
  console.log('\nAPI Gateway started successfully!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
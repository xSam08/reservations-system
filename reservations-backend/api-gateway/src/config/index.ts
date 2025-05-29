import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    hotel: process.env.HOTEL_SERVICE_URL || 'http://localhost:3003',
    reservation: process.env.RESERVATION_SERVICE_URL || 'http://localhost:3004',
    availability: process.env.AVAILABILITY_SERVICE_URL || 'http://localhost:3005',
    review: process.env.REVIEW_SERVICE_URL || 'http://localhost:3006',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3008',
    report: process.env.REPORT_SERVICE_URL || 'http://localhost:3009',
    search: process.env.SEARCH_SERVICE_URL || 'http://localhost:3010'
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
};
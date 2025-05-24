import { Router } from 'express';
import { createServiceProxy, createHealthProxy } from '../middleware/proxy.middleware';
import { authMiddleware, optionalAuth, requireRole } from '../middleware/auth.middleware';
import { authRateLimitMiddleware } from '../middleware/rate-limit.middleware';

const router = Router();

// Health check routes for all services
router.get('/auth/health', createHealthProxy('auth'));
router.get('/users/health', createHealthProxy('user'));
router.get('/hotels/health', createHealthProxy('hotel'));
router.get('/reservations/health', createHealthProxy('reservation'));
router.get('/reviews/health', createHealthProxy('review'));
router.get('/notifications/health', createHealthProxy('notification'));
router.get('/reports/health', createHealthProxy('report'));
router.get('/payments/health', createHealthProxy('payment'));
router.get('/availability/health', createHealthProxy('availability'));
router.get('/search/health', createHealthProxy('search'));

// Authentication routes (no auth required, but rate limited)
router.use('/auth/register', authRateLimitMiddleware);
router.use('/auth/login', authRateLimitMiddleware);
router.use('/auth', createServiceProxy('auth'));

// User management routes (authentication required)
router.use('/users', authMiddleware as any, createServiceProxy('user'));

// Hotel routes (public for viewing, auth required for management)
const hotelProxy = createServiceProxy('hotel', {
  pathRewrite: {
    '^/api': ''
  }
});

router.get('/hotels*', optionalAuth as any, hotelProxy);
router.post('/hotels*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, hotelProxy);
router.patch('/hotels*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, hotelProxy);
router.put('/hotels*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, hotelProxy);
router.delete('/hotels*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, hotelProxy);

// Room routes (public for viewing, auth required for management)
const roomProxy = createServiceProxy('hotel', {
  pathRewrite: {
    '^/api': ''
  }
});

router.get('/rooms*', optionalAuth as any, roomProxy);
router.post('/rooms*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, roomProxy);
router.patch('/rooms*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, roomProxy);
router.put('/rooms*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, roomProxy);
router.delete('/rooms*', authMiddleware as any, requireRole(['HOTEL_ADMIN', 'SYSTEM_ADMIN']) as any, roomProxy);

// Search routes (public)
router.use('/search', optionalAuth as any, createServiceProxy('search'));

// Availability routes (public for checking, auth required for management)
router.get('/availability*', optionalAuth as any, createServiceProxy('availability'));
router.use('/availability', authMiddleware as any, createServiceProxy('availability'));

// Reservation routes (authentication required)
router.use('/reservations', authMiddleware as any, createServiceProxy('reservation'));

// Review routes (auth required for creating, public for viewing)
router.get('/reviews*', optionalAuth as any, createServiceProxy('review'));
router.use('/reviews', authMiddleware as any, createServiceProxy('review'));

// Notification routes (authentication required)
router.use('/notifications', authMiddleware as any, createServiceProxy('notification'));

// Payment routes (authentication required)
router.use('/payments', authMiddleware as any, createServiceProxy('payment'));

// Report routes (admin/manager only)
router.use('/reports', authMiddleware as any, requireRole(['ADMIN', 'MANAGER']) as any, createServiceProxy('report'));

// Catch-all for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    availableEndpoints: [
      '/api/auth',
      '/api/users', 
      '/api/hotels',
      '/api/search',
      '/api/availability',
      '/api/reservations',
      '/api/reviews',
      '/api/notifications',
      '/api/payments',
      '/api/reports'
    ],
    timestamp: new Date().toISOString()
  });
});

export { router as routes };
import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    timestamp: new Date().toISOString()
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip} on ${req.url}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
      timestamp: new Date().toISOString()
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.url === '/health';
  }
});

// More restrictive rate limiting for auth endpoints
export const authRateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: 900, // 15 minutes
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Auth rate limit exceeded for IP: ${req.ip} on ${req.url}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: 900,
      timestamp: new Date().toISOString()
    });
  }
});
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from '../config';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const createServiceProxy = (serviceName: keyof typeof config.services, options: Partial<Options> = {}) => {
  const serviceUrl = config.services[serviceName];
  
  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${serviceName}`]: '',
    },
    timeout: 30000, // 30 seconds timeout
    onError: (err: any, req: Request, res: Response) => {
      console.error(`Proxy error for ${serviceName}:`, {
        error: err.message,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
      });
      
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: `Service ${serviceName} is temporarily unavailable`,
          error: config.nodeEnv === 'development' ? err.message : 'Service unavailable',
          timestamp: new Date().toISOString()
        });
      }
    },
    onProxyReq: (proxyReq, req, res) => {
      const authReq = req as AuthenticatedRequest;
      
      // Forward user information if authenticated
      if (authReq.user) {
        proxyReq.setHeader('X-User-Id', authReq.user.userId);
        proxyReq.setHeader('X-User-Email', authReq.user.email);
        proxyReq.setHeader('X-User-Role', authReq.user.role);
      }
      
      // Add correlation ID for tracing
      const correlationId = req.headers['x-correlation-id'] || `gw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      proxyReq.setHeader('X-Correlation-Id', correlationId);
      
      console.log(`→ Proxying ${req.method} ${req.url} to ${serviceName} (${serviceUrl})`, {
        correlationId,
        userId: authReq.user?.userId,
        timestamp: new Date().toISOString()
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      const correlationId = req.headers['x-correlation-id'];
      console.log(`← Response from ${serviceName}: ${proxyRes.statusCode}`, {
        correlationId,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
      });
      
      // Add CORS headers if not present
      if (!proxyRes.headers['access-control-allow-origin']) {
        proxyRes.headers['access-control-allow-origin'] = '*';
      }
    },
    ...options
  });
};

// Health check proxy that doesn't require authentication
export const createHealthProxy = (serviceName: keyof typeof config.services) => {
  const serviceUrl = config.services[serviceName];
  
  return createProxyMiddleware({
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${serviceName}/health`]: '/health',
    },
    timeout: 5000, // 5 seconds timeout for health checks
    onError: (err: any, req: Request, res: Response) => {
      console.error(`Health check proxy error for ${serviceName}:`, err.message);
      
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: `Service ${serviceName} health check failed`,
          service: serviceName,
          timestamp: new Date().toISOString()
        });
      }
    }
  });
};
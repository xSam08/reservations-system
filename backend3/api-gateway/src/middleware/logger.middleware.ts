import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  console.log(`→ ${req.method} ${req.url}`, {
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    headers: process.env.NODE_ENV === 'development' ? req.headers : undefined
  });

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - start;
    
    console.log(`← ${req.method} ${req.url} ${res.statusCode}`, {
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      contentLength: res.get('Content-Length')
    });
    
    return originalEnd(chunk, encoding, cb);
  };

  next();
};
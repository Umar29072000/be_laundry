import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

// In-memory store untuk rate limiting (per-process, cocok untuk single instance)
const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter middleware.
 * @param limit Max number of requests allowed in the window.
 * @param windowSeconds Window size in seconds.
 */
export const rateLimiter = (limit: number, windowSeconds: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${ip}:${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = requestCounts.get(key);

    if (!record || now > record.resetAt) {
      // Window baru atau sudah expired
      requestCounts.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', limit - 1);
      return next();
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - record.count));

    if (record.count > limit) {
      return next(new AppError('Too many requests from this IP, please try again later.', 429));
    }

    next();
  };
};

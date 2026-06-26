import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/AppError';
import { rateLimiter } from './middlewares/rateLimiter.middleware';

import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import customerRoutes from './routes/customer.routes';
import serviceRoutes from './routes/service.routes';
import orderRoutes from './routes/order.routes';
import reportRoutes from './routes/report.routes';

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global Rate Limiting: Max 100 requests per minute per endpoint for any IP
app.use('/api', rateLimiter(100, 60));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Implement CORS — hanya izinkan request dari frontend yang terdaftar
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (Postman, curl, dll)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin '${origin}' is not allowed.`));
    },
    credentials: true,
  })
);

// Strict Rate Limiting on authentication to prevent brute-force (Max 10 per minute)
app.use('/api/auth/login', rateLimiter(10, 60));
app.use('/api/auth/register', rateLimiter(10, 60));

// 2) ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;

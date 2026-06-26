import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { prisma } from '../models/db';

export interface AuthRequest extends Request {
  tenant?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

    const currentUser = await prisma.tenant.findUnique({ where: { id: decoded.id } });
    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.tenant = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or token has expired', 401));
  }
};

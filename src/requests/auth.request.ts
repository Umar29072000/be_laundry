import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    storeName: z.string({ message: 'Store name is required' }).min(3, 'Store name must be at least 3 characters'),
    ownerName: z.string({ message: 'Owner name is required' }),
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z.string({ message: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    phone: z.string({ message: 'Phone number is required' }),
    address: z.string({ message: 'Address is required' }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }).email('Invalid email address'),
    password: z.string({ message: 'Password is required' }),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    storeName: z.string().min(3).optional(),
    ownerName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ message: 'Old password is required' }),
    newPassword: z.string({ message: 'New password is required' }).min(6, 'New password must be at least 6 characters'),
  }),
});

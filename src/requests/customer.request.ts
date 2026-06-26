import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string({ message: 'Phone number is required' }),
    address: z.string({ message: 'Address is required' }),
  }),
});

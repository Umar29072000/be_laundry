import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Service name is required' }),
    price: z.number({ message: 'Price is required' }).positive('Price must be positive'),
    unit: z.string({ message: 'Unit is required' }),
  }),
});

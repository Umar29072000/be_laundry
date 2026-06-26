import { z } from 'zod';
import { PaymentMethod, OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string({ message: 'Customer ID is required' }),
    paymentMethod: z.nativeEnum(PaymentMethod, { message: 'Invalid payment method' }),
    items: z.array(
      z.object({
        serviceId: z.string({ message: 'Service ID is required' }),
        quantity: z.number({ message: 'Quantity is required' }).positive('Quantity must be greater than 0'),
      })
    ).min(1, 'Order must contain at least 1 item'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus, { message: 'Invalid order status' }),
  }),
});

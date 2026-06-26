import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';
import { OrderResponseDTO } from '../responses/order.response';

export const getOrders = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const orders = await orderService.getOrders(req.tenant.id);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders: OrderResponseDTO.formatMany(orders),
    },
  });
});

export const createOrder = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { customerId, items, paymentMethod } = req.body;
  const newOrder = await orderService.createOrder(req.tenant.id, { customerId, items, paymentMethod });

  res.status(201).json({
    status: 'success',
    data: {
      order: OrderResponseDTO.format(newOrder),
    },
  });
});

export const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const orderId = req.params.id as string;
  const updatedOrder = await orderService.updateOrderStatus(req.tenant.id, orderId, status);

  res.status(200).json({
    status: 'success',
    data: {
      order: OrderResponseDTO.format(updatedOrder),
    },
  });
});

export const trackOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id as string;
  const order = await orderService.trackOrder(orderId);

  res.status(200).json({
    status: 'success',
    data: {
      order: OrderResponseDTO.format(order),
    },
  });
});

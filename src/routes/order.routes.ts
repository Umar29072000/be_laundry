import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus, trackOrder } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../requests/order.request';

const router = Router();

// Public route for tracking
router.get('/track/:id', trackOrder);

// Protected routes
router.use(protect);

router.route('/')
  .get(getOrders)
  .post(validateRequest(createOrderSchema), createOrder);

router.put('/:id/status', validateRequest(updateOrderStatusSchema), updateOrderStatus);

export default router;

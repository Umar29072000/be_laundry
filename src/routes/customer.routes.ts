import { Router } from 'express';
import { getCustomers, createCustomer, deleteCustomer } from '../controllers/customer.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createCustomerSchema } from '../requests/customer.request';

const router = Router();

router.use(protect);

router.route('/')
  .get(getCustomers)
  .post(validateRequest(createCustomerSchema), createCustomer);

router.route('/:id')
  .delete(deleteCustomer);

export default router;

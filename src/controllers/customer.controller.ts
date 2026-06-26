import { Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CustomerResponseDTO } from '../responses/customer.response';

export const getCustomers = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const customers = await customerService.getCustomers(req.tenant.id);

  res.status(200).json({
    status: 'success',
    results: customers.length,
    data: {
      customers: CustomerResponseDTO.formatMany(customers),
    },
  });
});

export const createCustomer = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, email, phone, address } = req.body;
  const customer = await customerService.createCustomer(req.tenant.id, { name, email, phone, address });

  res.status(201).json({
    status: 'success',
    data: {
      customer: CustomerResponseDTO.format(customer),
    },
  });
});

export const deleteCustomer = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const customerId = req.params.id as string;
  await customerService.deleteCustomer(req.tenant.id, customerId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

import { Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getServices = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const services = await serviceService.getServices(req.tenant.id);

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: { services },
  });
});

export const createService = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { name, price, unit } = req.body;
  const service = await serviceService.createService(req.tenant.id, { name, price, unit });

  res.status(201).json({
    status: 'success',
    data: { service },
  });
});

export const deleteService = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const serviceId = req.params.id as string;
  await serviceService.deleteService(req.tenant.id, serviceId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

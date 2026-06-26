import { Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getDashboardStats = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const data = await dashboardService.getDashboardStats(req.tenant.id);

  res.status(200).json({
    status: 'success',
    data,
  });
});

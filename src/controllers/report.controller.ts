import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getReports = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const period = req.query.period as string | undefined;
  const reportData = await reportService.getReports(req.tenant.id, period);

  res.status(200).json({
    status: 'success',
    data: { report: reportData },
  });
});

import { Response, NextFunction } from 'express';
import { reportExportService } from '../services/report-export.service';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/auth.middleware';
import { TenantRepository } from '../repositories/tenant.repository';

const tenantRepo = new TenantRepository();

export const exportReports = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const period = req.query.period as string | undefined;
  const tenant = await tenantRepo.findById(req.tenant.id);
  const storeName = tenant?.storeName || 'Laundry';

  const buffer = await reportExportService.generateExcelReport(req.tenant.id, period, storeName);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="laporan-keuangan-${storeName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx"`);
  res.send(buffer);
});

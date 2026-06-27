import { Router } from 'express';
import { exportReports } from '../controllers/report-export.controller';

const router = Router();

router.get('/export', exportReports);

export default router;

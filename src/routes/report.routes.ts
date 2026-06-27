import { Router } from 'express';
import { getReports } from '../controllers/report.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getReports);

export default router;

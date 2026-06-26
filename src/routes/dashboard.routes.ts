import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getDashboardStats);

export default router;

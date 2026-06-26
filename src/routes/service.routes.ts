import { Router } from 'express';
import { getServices, createService, deleteService } from '../controllers/service.controller';
import { protect } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { createServiceSchema } from '../requests/service.request';

const router = Router();

router.use(protect);

router.route('/')
  .get(getServices)
  .post(validateRequest(createServiceSchema), createService);

router.route('/:id')
  .delete(deleteService);

export default router;

import { Router } from 'express';
import { register, login, getProfile, updateProfile, updatePassword, updateProfilePicture } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from '../requests/auth.request';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.put('/password', validateRequest(updatePasswordSchema), updatePassword);
router.post('/profile-picture', upload.single('photo'), updateProfilePicture);

export default router;

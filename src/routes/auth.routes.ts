import { Router } from 'express';
import { loginAdmin, loginStudent, logout, register } from '../controllers/auth.controller';
import { loginLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, loginStudent);
router.post('/admin/login', loginLimiter, loginAdmin);
router.post('/logout', logout);

export default router;

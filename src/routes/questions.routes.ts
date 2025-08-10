import { Router } from 'express';
import { getActiveQuestions } from '../controllers/questions.controller';

const router = Router();

router.get('/active', getActiveQuestions);

export default router;

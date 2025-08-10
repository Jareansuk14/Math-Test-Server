import { Router } from 'express';
import { completeExam, getSummary, startExam, submitAnswer } from '../controllers/exam.controller';
import { requireAuth } from '../middleware/auth';
import { answerLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/start', requireAuth, startExam);
router.post('/:sessionId/answer', requireAuth, answerLimiter, submitAnswer);
router.post('/:sessionId/complete', requireAuth, completeExam);
router.get('/summary/:resultId', requireAuth, getSummary);

export default router;

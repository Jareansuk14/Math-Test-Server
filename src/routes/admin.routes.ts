import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { getUploadUrl, getViewUrl, listResults, listStudents, publishQuestionSet } from '../controllers/admin.controller';

const router = Router();

router.post('/questionset/publish', requireAuth, requireAdmin, publishQuestionSet);
router.get('/students', requireAuth, requireAdmin, listStudents);
router.get('/results', requireAuth, requireAdmin, listResults);
router.post('/upload-url', requireAuth, requireAdmin, getUploadUrl);
router.post('/view-url', requireAuth, requireAdmin, getViewUrl);

export default router;

import { Router } from 'express';
import userInputController from '../controllers/userInputController';
import upload from '../config/multer';

const router = Router();

router.post('/users-input', upload.single('resume'), userInputController.create);
router.get('/users-input/:id', userInputController.getById);
router.get('/users-input/:id/resume', userInputController.getResume);

export default router;
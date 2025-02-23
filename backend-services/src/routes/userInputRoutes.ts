import { Router } from 'express';
import userInputController from '../controllers/userInputController';
import { uploadMiddleware } from '../config/multer';

const router = Router();

router.post('/users-input', uploadMiddleware, userInputController.create);
router.get('/users-input/:id', userInputController.getById);
router.get('/users-input/:id/resume', userInputController.getResume);
router.put('/users-input/:id', uploadMiddleware, userInputController.update);


export default router;
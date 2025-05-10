import { Router } from 'express';
import userInputController from '../controllers/userInputController';
import { uploadMiddleware } from '../config/multer';

const router = Router();

// Existing routes
router.post('/users-input', uploadMiddleware, userInputController.create);
router.get('/users-input/:id', userInputController.getById);
router.get('/users-input/:id/resume', userInputController.getResume);
router.put('/users-input/:id', uploadMiddleware, userInputController.update);
router.delete('/users-input/:id', userInputController.deleteUserInput);

// New email verification routes
router.get('/verify-email', userInputController.verifyEmail);
router.get('/check-email-status/:id', userInputController.checkEmailStatus);
router.post('/check-email-userid', userInputController.checkEmailUserInput);
router.post('/resend-verification/:id', userInputController.resendVerification);

export default router;
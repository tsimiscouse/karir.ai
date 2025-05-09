import express from 'express';
import { getUserReport, downloadUserReportPdf } from '../controllers/userReportController';

const router = express.Router();

/**
 * @route GET /api/reports/:userId
 * @desc Get job matching results and resume scoring for a specific user
 * @access Private
 */
router.get('/:userId', getUserReport);

/**
 * @route GET /api/reports/:userId/pdf
 * @desc Download job matching results and resume scoring as PDF
 * @access Private
 */
router.get('/:userId/pdf', downloadUserReportPdf);

export default router;
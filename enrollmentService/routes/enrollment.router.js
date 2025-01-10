'use strict';
import express from 'express';
import { enrollmentController } from '../controllers/enrollment.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', bdtRequired, asyncHandler(enrollmentController.search));
router.get(
    '/student/:classId',
    asyncHandler(enrollmentController.getStudentInClass),
);
router.get('/', asyncHandler(enrollmentController.getRegisteredClasses));
router.post('/', asyncHandler(enrollmentController.create));
router.put('/delete', asyncHandler(enrollmentController.delete));

export default router;

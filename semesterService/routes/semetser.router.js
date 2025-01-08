'use strict';
import express from 'express';
import { SemesterController } from '../controllers/semester.controller.js';
import { ScheduleController } from '../controllers/schedule.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired, authRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', asyncHandler(SemesterController.search));
router.get(
    '/:semesterId/schedule',
    asyncHandler(ScheduleController.findSchedulesBySemester),
);
router.get('/:id', asyncHandler(SemesterController.findById));

// bdt required
router.post('/', bdtRequired, asyncHandler(SemesterController.create));
router.put('/', bdtRequired, asyncHandler(SemesterController.update));

export default router;

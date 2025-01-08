'use strict';
import express from 'express';
import { SemesterController } from '../controllers/semester.controller.js';
import { ScheduleController } from '../controllers/schedule.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { authRequired, bdtRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', asyncHandler(ScheduleController.search));
router.get(
    '/available',
    asyncHandler(ScheduleController.findAvailableSchedules),
);
router.get('/checkAccess/:yoa', asyncHandler(ScheduleController.checkAccess));
router.get('/:_id', asyncHandler(ScheduleController.findById));

// bdt required
router.post('/', bdtRequired, asyncHandler(ScheduleController.create));
router.put('/', bdtRequired, asyncHandler(ScheduleController.update));

export default router;

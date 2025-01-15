'use strict';
import express from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { authRequired, bdtRequired } from '../middlewares/auth.middleware.js';
import { ClassController } from '../controllers/class.controller.js';

const router = express.Router();

router.get(
    '/openCourses/semester/:semesterId',
    asyncHandler(ClassController.getOpenCourses),
);

// auth required
router.get('/search', asyncHandler(ClassController.search));
router.get('/:id', asyncHandler(ClassController.findById));

// bdtRequired
router.put('/sync', bdtRequired, asyncHandler(ClassController.syncInfor));
router.post('/', bdtRequired, asyncHandler(ClassController.create));
router.put('/finish', bdtRequired, asyncHandler(ClassController.finish));
router.put('/', bdtRequired, asyncHandler(ClassController.update));

export default router;

'use strict';
import express from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { authRequired, bdtRequired } from '../middlewares/auth.middleware.js';
import { ClassController } from '../controllers/class.controller.js';

const router = express.Router();

router.get('/search', authRequired, asyncHandler(ClassController.search));
router.get(
    '/:semesterId/courses',
    authRequired,
    asyncHandler(ClassController.getOpenCourses),
);
router.get('/:id', authRequired, asyncHandler(ClassController.findById));

// bdtRequired
router.post('/', bdtRequired, asyncHandler(ClassController.create));
router.put('/', bdtRequired, asyncHandler(ClassController.update));

export default router;

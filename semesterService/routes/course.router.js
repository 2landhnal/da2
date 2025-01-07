'use strict';
import express from 'express';
import { courseController } from '../controllers/course.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', asyncHandler(courseController.search));
router.get('/:id', asyncHandler(courseController.findById));

router.use(bdtRequired);
router.post('/', asyncHandler(courseController.create));
router.put('/', asyncHandler(courseController.update));
router.delete('/:id', asyncHandler(courseController.closeById));

export default router;

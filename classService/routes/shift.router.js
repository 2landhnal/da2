'use strict';
import express from 'express';
import { ShiftController } from '../controllers/shift.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', asyncHandler(ShiftController.search));
router.get('/:id', asyncHandler(ShiftController.findById));

// bdtRequired
router.post('/', bdtRequired, asyncHandler(ShiftController.create));
router.put('/', bdtRequired, asyncHandler(ShiftController.update));

export default router;

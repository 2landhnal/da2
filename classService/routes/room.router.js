'use strict';
import express from 'express';
import { RoomController } from '../controllers/room.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bcsvcRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', asyncHandler(RoomController.search));
router.get('/:id', asyncHandler(RoomController.findById));

// bcsvcRequired
router.post('/', bcsvcRequired, asyncHandler(RoomController.create));
router.put('/', bcsvcRequired, asyncHandler(RoomController.update));
router.put('/close/:id', bcsvcRequired, asyncHandler(RoomController.closeById));
router.put(
    '/active/:id',
    bcsvcRequired,
    asyncHandler(RoomController.activeById),
);

export default router;

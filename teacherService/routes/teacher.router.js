'use strict';
import express from 'express';
import { teacherController } from '../controllers/teacher.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { btcnsRequired } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
    '/changeAvatar',
    upload.single('avatar'),
    asyncHandler(teacherController.changeAvatar),
);
router.post(
    '/',
    btcnsRequired,
    upload.single('avatar'),
    asyncHandler(teacherController.register),
);
router.put('/', asyncHandler(teacherController.update));
router.get('/search', asyncHandler(teacherController.search));
router.get('/:uid', asyncHandler(teacherController.findByUid));

export default router;

'use strict';
import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.delete('/logout', asyncHandler(authController.logout));
router.get(
    '/refreshAccessToken',
    asyncHandler(authController.refreshAccessToken),
);

// bdt required
router.get('/search', asyncHandler(authController.search));

export default router;

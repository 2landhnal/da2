'use strict';
import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired, authentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

//router.post('/register', asyncHandler(authController.register));

// cookies required
router.post('/login', asyncHandler(authController.login));
router.delete('/logout', asyncHandler(authController.logout));
router.get(
    '/refreshAccessToken',
    asyncHandler(authController.refreshAccessToken),
);

// auth
router.put('/changePassword', asyncHandler(authController.changePassword));
// bdt required
router.post('/sync', bdtRequired, asyncHandler(authController.syncStatus));

export default router;

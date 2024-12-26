'use strict';
import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));

export default router;

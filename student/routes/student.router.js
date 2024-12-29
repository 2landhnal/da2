'use strict';
import express from 'express';
import { studentController } from '../controllers/student.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bctsvRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', bctsvRequired, asyncHandler(studentController.register));

export default router;

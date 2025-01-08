'use strict';
import express from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bdtRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();

//

router.use(bdtRequired);
//

export default router;

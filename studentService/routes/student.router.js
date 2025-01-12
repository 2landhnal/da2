'use strict';
import express from 'express';
import { studentController } from '../controllers/student.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { bctsvRequired, authRequired } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.put(
    '/changeAvatar',
    (req, res, next) => {
        console.log(req.body);
        next();
    },
    upload.single('avatar'),
    authRequired,
    asyncHandler(studentController.changeAvatar),
);
router.post('/sync', bctsvRequired, asyncHandler(studentController.syncInfor));
router.post(
    '/',
    bctsvRequired,
    upload.single('avatar'),
    asyncHandler(studentController.register),
);
router.put('/', authRequired, asyncHandler(studentController.update));
router.get('/search', asyncHandler(studentController.search));
router.get('/:uid', asyncHandler(studentController.findByUid));

export default router;

"use strict"
import express from 'express';
import accountController from '../../controllers/accountController.js';
import tokenController from '../../controllers/tokenController.js';
const router = express.Router();

router.put('/update', accountController.update);
router.get('/getAccount', accountController.getAccount);
router.delete('/logout', accountController.logout);
router.get('/checkAuth', tokenController.checkAccess);

export default router;

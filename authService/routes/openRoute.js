"use strict"
import express from 'express';
import accountController from '../controllers/accountController.js';
import tokenController from '../controllers/tokenController.js';
const router = express.Router();

router.post('/login', accountController.login);
router.post('/create', accountController.create);
router.get('/isAccountExist/:accountId', accountController.getAccount);
router.post('/refreshAccessToken', tokenController.refreshAccessToken);

export default router;

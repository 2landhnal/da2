import express from 'express';
import accountController from '../../controllers/accountController.js';
import tokenController from '../../controllers/tokenController.js';
const router = express.Router();

router.delete('/delete/:email', accountController.delete);

export default router;

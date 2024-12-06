import express, { Router } from 'express';
import studentRoute from './student';

const router: Router = express.Router();

router.use('/', studentRoute);

export default router;

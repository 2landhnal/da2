import express, { Router } from 'express';
import teacherROute from './teacher';

const router: Router = express.Router();

router.use('/', teacherROute);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import { studentController, authenticateMiddleware } from '../controllers';

const router = express.Router();

// Create new course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body = {...courseId, courseName, courseCredit}
// RETURN: {msg}
router.post('/create', authenticateMiddleware, studentController.create);

// Find course by id
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get(
    '/findById/:studentId',
    authenticateMiddleware,
    studentController.findById,
);

// Find courses by name
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [courses]
router.get(
    '/findByName/:keyword',
    authenticateMiddleware,
    studentController.findByName,
);

// Update course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {course}
router.put('/update', authenticateMiddleware, studentController.update);

// Delete course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.delete(
    '/delete/:studentId',
    authenticateMiddleware,
    studentController.delete,
);

// Test auth middleware
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get('/testAuth', authenticateMiddleware, studentController.testAuth);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(process.env.AUTH_URL);
    res.send({ msg: 'Teacher service' });
});

export default router;

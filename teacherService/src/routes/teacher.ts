import express, { Request, Response, NextFunction } from 'express';
import { teacherController, authenticateMiddleware } from '../controllers';

const router = express.Router();

// Create new course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body = {...courseId, courseName, courseCredit}
// RETURN: {msg}
// router.post('/create', authenticateMiddleware, teacherController.create);

// Create new student and account
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body = {...studentId, studentName, studentCredit}
// RETURN: {msg}
router.post(
    '/register/:numberOfSuffix',
    authenticateMiddleware,
    teacherController.register,
);

// Find course by id
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get(
    '/findById/:teacherId',
    authenticateMiddleware,
    teacherController.findById,
);

// Find courses by name
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [courses]
router.get(
    '/findByName/:keyword',
    authenticateMiddleware,
    teacherController.findByName,
);

// Update course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {course}
router.put('/update', authenticateMiddleware, teacherController.update);

// Delete course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.delete(
    '/delete/:teacherId',
    authenticateMiddleware,
    teacherController.delete,
);

// Test auth middleware
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get('/testAuth', authenticateMiddleware, teacherController.testAuth);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    console.log(process.env.AUTH_URL);
    res.send({ msg: 'Teacher service' });
});

export default router;

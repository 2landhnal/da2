import express, { Request, Response, NextFunction } from 'express';
import { studentController, authenticateMiddleware } from '../controllers';

const router = express.Router();

// Create new student
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body = {...studentId, studentName, studentCredit}
// RETURN: {msg}
// router.post('/create', authenticateMiddleware, studentController.create);

// Create new student and account
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body = {...studentId, studentName, studentCredit}
// RETURN: {msg}
router.post(
    '/register/:numberOfSuffix',
    authenticateMiddleware,
    studentController.register,
);

// Find student by id
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get(
    '/findById/:studentId',
    authenticateMiddleware,
    studentController.findById,
);

// Find students by name
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [students]
router.get(
    '/findByName/:keyword',
    authenticateMiddleware,
    studentController.findByName,
);

// Find students by name
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [students]
router.get('/find', authenticateMiddleware, studentController.find);

// Update student
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {student}
router.put('/update', authenticateMiddleware, studentController.update);

// Delete student
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

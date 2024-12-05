const express = require('express');
const router = express.Router();
const {
    courseController,
    authenticateMiddleware,
} = require('../controllers/courseController');

// Create new course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body = {...courseId, courseName, courseCredit}
// RETURN: {msg}
router.post('/create', authenticateMiddleware, courseController.create);

// Find course by id
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get(
    '/findById/:courseId',
    authenticateMiddleware,
    courseController.findById,
);

// Find courses by credit
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [courses]
router.get(
    '/findByCredit/:courseCredit',
    authenticateMiddleware,
    courseController.findByCredit,
);

// Find courses by name
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [courses]
router.get(
    '/findByName/:keyword',
    authenticateMiddleware,
    courseController.findByName,
);

// Find courses by keyword
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [courses]
router.get('/find/:keyword', authenticateMiddleware, courseController.find);

// Update course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {course}
router.put('/update', authenticateMiddleware, courseController.findById);

// Delete course
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.delete(
    '/delete/:courseId',
    authenticateMiddleware,
    courseController.delete,
);

// Test auth middleware
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.get('/testAuth', authenticateMiddleware, courseController.testAuth);

router.get('/', (req, res, next) => {
    console.log(process.env.AUTH_URL);
    res.send({ msg: 'Course service' });
});

module.exports = router;

const Course = require('../models/course');
const axios = require('axios');

class CourseController {
    // [POST] /create
    async create(req, res, next) {
        try {
            const newCourse = new Course({
                courseId: req.body.courseId,
                courseName: req.body.courseName,
                courseCredit: req.body.courseCredit,
            });
            await newCourse.save();
            res.send({
                msg: `Create course ${req.body.courseId} successfully`,
            });
        } catch (err) {
            res.send(err);
        }
    }

    // [GET] /findById/:courseId
    async findById(req, res, next) {
        try {
            const course = await Course.findOne({
                courseId: req.params.courseId,
            });
            if (course == null) {
                res.send({
                    msg: `Course with id ${req.params.courseId} not found`,
                });
                return;
            }
            res.send(course);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    // [GET] /findByName/:keyword
    async findByName(req, res, next) {
        try {
            const courses = await Course.find({
                courseName: { $regex: req.params.keyword, $options: 'i' },
            });
            if (courses.length == 0) {
                res.send({
                    msg: `Courses not found`,
                });
                return;
            }
            res.send(courses);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    // [GET] /findByCredit/:courseCredit
    async findByCredit(req, res, next) {
        try {
            const courses = await Course.find({
                courseCredit: req.params.courseCredit,
            });
            if (courses == 0) {
                res.send({
                    msg: `Courses with number of credit = ${req.params.courseCredit} not found`,
                });
                return;
            }
            res.send(courses);
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    // [GET] /find/:keyword
    async find(req, res, next) {
        try {
            const fieldsToSearch = ['courseId', 'courseName']; // Define fields to search
            const regex = new RegExp(req.params.keyword, 'i'); // Case-insensitive regex

            const query = {
                $or: fieldsToSearch.map((field) => ({
                    [field]: { $regex: regex },
                })),
            };

            const results = await Course.find(query);
            console.log('Matching documents:', results);
            res.send(results);
        } catch (err) {
            console.error('Error finding documents:', err);
        }
    }

    // [DELETE] /delete/:courseId
    async delete(req, res, next) {
        try {
            const course = await Course.deleteOne({
                courseId: req.params.courseId,
            });
            res.send({
                msg: `Deleted course with id ${req.params.courseId}`,
            });
        } catch (err) {
            console.log(err);
            res.send(err);
        }
    }

    // [PUT] /update
    async update(req, res, next) {
        try {
            const course = await Course.findOne({
                courseId: req.body.courseId,
            });
            if (course != null) {
                res.send({
                    msg: `Course with id ${req.body.courseId} not found`,
                });
            }
            if (req.body.courseName) course.courseName = req.body.courseName;
            if (req.body.courseCredit)
                course.courseCredit = req.body.courseCredit;
            res.send(course);
        } catch (err) {
            res.send(err);
        }
    }

    // [GET] /testAuth
    async testAuth(req, res, next) {
        try {
            const accountId = req.body.accountId;
            res.send({
                msg: `Auth successfully, accountId: ${accountId} `,
            });
        } catch (err) {
            res.send(err);
        }
    }
}

async function validateTokenWithAuthService(authHeader) {
    try {
        const response = await axios.get(
            `${process.env.AUTH_URL}/validateToken`,
            { headers: { authorization: authHeader } },
        );
        // Trả về accountId nếu token hợp lệ
        return response.data.accountId;
    } catch (error) {
        console.error(
            'Token validation failed:',
            error.response?.data || error.message,
        );
        throw new Error('Unauthorized');
    }
}

async function authenticateMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res
            .status(401)
            .send({ msg: 'Authorization header is required' });

    try {
        const accountId = await validateTokenWithAuthService(authHeader);
        req.body.accountId = accountId; // Gắn accountId vào req để dùng sau
        next();
    } catch (error) {
        res.status(403).send({ msg: 'Forbidden' });
    }
}

module.exports = {
    courseController: new CourseController(),
    authenticateMiddleware,
};

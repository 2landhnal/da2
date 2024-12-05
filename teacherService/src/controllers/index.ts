import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import Course from '../models/course';
import axios from 'axios';

class CourseController {
    // [POST] /create
    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { courseId, courseName, courseCredit } = req.body;
            const newCourse = new Course({
                courseId,
                courseName,
                courseCredit,
            });
            await newCourse.save();
            res.send({ msg: `Create course ${courseId} successfully` });
        } catch (err) {
            res.status(500).send(err);
        }
    }

    // [GET] /findById/:courseId
    async findById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { courseId } = req.params;
            const course = await Course.findOne({ courseId });
            if (!course) {
                res.send({ msg: `Course with id ${courseId} not found` });
                return;
            }
            res.send(course);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [GET] /findByName/:keyword
    async findByName(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { keyword } = req.params;
            const courses = await Course.find({
                courseName: { $regex: keyword, $options: 'i' },
            });
            if (courses.length === 0) {
                res.send({ msg: `Courses not found` });
                return;
            }
            res.send(courses);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [GET] /findByCredit/:courseCredit
    async findByCredit(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { courseCredit } = req.params;
            const courses = await Course.find({
                courseCredit: Number(courseCredit),
            });
            if (courses.length === 0) {
                res.send({
                    msg: `Courses with number of credit = ${courseCredit} not found`,
                });
                return;
            }
            res.send(courses);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [GET] /find/:keyword
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { keyword } = req.params;
            const regex = new RegExp(keyword, 'i');
            const fieldsToSearch = ['courseId', 'courseName'];

            const query = {
                $or: fieldsToSearch.map((field) => ({
                    [field]: { $regex: regex },
                })),
            };

            const results = await Course.find(query);
            res.send(results);
        } catch (err) {
            console.error('Error finding documents:', err);
            res.status(500).send(err);
        }
    }

    // [DELETE] /delete/:courseId
    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { courseId } = req.params;
            await Course.deleteOne({ courseId });
            res.send({ msg: `Deleted course with id ${courseId}` });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [PUT] /update
    async update(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { courseId, courseName, courseCredit } = req.body;
            const course = await Course.findOne({ courseId });
            if (!course) {
                res.send({ msg: `Course with id ${courseId} not found` });
                return;
            }

            if (courseName) course.courseName = courseName;
            if (courseCredit) course.courseCredit = courseCredit;
            await course.save();

            res.send(course);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [GET] /testAuth
    async testAuth(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const accountId = req.body.accountId;
            res.send({ msg: `Auth successfully, accountId: ${accountId}` });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }
}

async function validateTokenWithAuthService(
    authHeader: string,
): Promise<string> {
    try {
        const response = await axios.get(
            `${process.env.AUTH_URL}/validateToken`,
            {
                headers: { authorization: authHeader },
            },
        );
        return response.data.accountId; // Return accountId if token is valid
    } catch (error: any) {
        console.error(
            'Token validation failed:',
            error.response?.data || error.message,
        );
        throw new Error('Unauthorized');
    }
}

async function authenticateMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).send({ msg: 'Authorization header is required' });
        return;
    }

    try {
        const accountId = await validateTokenWithAuthService(authHeader);
        req.body.accountId = accountId; // Attach accountId to the request for future use
        next();
    } catch (error) {
        res.status(403).send({ msg: 'Forbidden' });
    }
}

export const courseController = new CourseController();
export { authenticateMiddleware };

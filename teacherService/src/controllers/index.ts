import { Request, Response, NextFunction } from 'express';
import TeacherModel from '../models/teacher';
import { post, get } from '../utils/httpRequests';
import axios from 'axios';

class TeacherController {
    // [POST] /create
    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { ...updateFields } = req.body;
            const newTeacher = new TeacherModel({
                ...updateFields,
            });
            // create account
            // await post(process.env.AUTH_URL, '/create', {})
            await newTeacher.save();
            
            res.send({
                msg: `Add new teacher with id = ${newTeacher.teacherId} successfully`,
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }

    // [GET] /findById/:teacherId
    async findById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { teacherId } = req.params;
            const teacher = await TeacherModel.findOne({ teacherId });
            if (!teacher) {
                res.send({ msg: `Teacher with id ${teacherId} not found` });
                return;
            }
            res.send(teacher);
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
            const teachers = await TeacherModel.find({
                fullName: { $regex: keyword, $options: 'i' },
            });
            if (teachers.length === 0) {
                res.send({ msg: `Teachers not found` });
                return;
            }
            res.send(teachers);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [DELETE] /delete/:teacherId
    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { teacherId } = req.params;
            await TeacherModel.deleteOne({ teacherId });
            res.send({ msg: `Deleted teacher with id ${teacherId}` });
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
            const { teacherId, ...updateFields } = req.body;

            const teacher = await TeacherModel.findOne({ teacherId });
            if (!teacher) {
                res.send({ msg: `Teacher with id ${teacherId} not found` });
                return;
            }

            // Duyệt qua các trường để cập nhật
            Object.entries(updateFields).forEach(([key, value]) => {
                if (value !== undefined) {
                    (teacher as any)[key] = value; // Ép kiểu nếu key không có trong model
                }
            });

            await teacher.save();

            res.send(teacher);
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

export const teacherController = new TeacherController();
export { authenticateMiddleware };

// "teacherId",
// "fullName",
// "address",
// "phone",
// "dob",
// "gender",
// "degree",
// "email",

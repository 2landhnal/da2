import { Request, Response, NextFunction } from 'express';
import StudentModel from '../models/student';
import { post, get } from '../utils/httpRequests';
import axios from 'axios';

class StudentController {
    // [POST] /create
    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { ...updateFields } = req.body;
            const newStudent = new StudentModel({
                ...updateFields,
            });
            // create account
            // await post(process.env.AUTH_URL, '/create', {})
            await newStudent.save();
            res.send({
                msg: `Add new Student with id = ${newStudent.studentId} successfully`,
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }

    // [GET] /findById/:studentId
    async findById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { studentId } = req.params;
            const student = await StudentModel.findOne({ studentId });
            if (!student) {
                res.send({ msg: `Student with id ${studentId} not found` });
                return;
            }
            res.send(student);
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
            const students = await StudentModel.find({
                fullName: { $regex: keyword, $options: 'i' },
            });
            if (students.length === 0) {
                res.send({ msg: `Students not found` });
                return;
            }
            res.send(students);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }

    // [DELETE] /delete/:studentId
    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { studentId } = req.params;
            await StudentModel.deleteOne({ studentId });
            res.send({ msg: `Deleted Student with id ${studentId}` });
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
            const { studentId, ...updateFields } = req.body;

            const student = await StudentModel.findOne({ studentId });
            if (!student) {
                res.send({ msg: `Student with id ${studentId} not found` });
                return;
            }

            // Duyệt qua các trường để cập nhật
            Object.entries(updateFields).forEach(([key, value]) => {
                if (value !== undefined) {
                    (student as any)[key] = value; // Ép kiểu nếu key không có trong model
                }
            });

            await student.save();

            res.send(student);
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

const studentController = new StudentController();
export { authenticateMiddleware, studentController };

// "studentId",
// "fullName",
// "address",
// "phone",
// "dob",
// "gender",
// "degree",
// "email",

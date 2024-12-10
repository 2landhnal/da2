import { Request, Response, NextFunction } from 'express';
import StudentModel, { Student } from '../models/student';
import { post, get } from '../utils/httpRequests';
import axios from 'axios';

class StudentController {
    constructor() {
        this.create = this.create.bind(this);
    }
    // [POST] /register/:numberOfSuffix
    async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        console.log('Start register');
        try {
            const numberOfSuffix = parseInt(req.params.numberOfSuffix);
            const { yoa, email, ...otherFields } = req.body;
            // fetch current number of student with same yoa
            const numberOfStudentWithYoa = await StudentModel.where({
                yoa,
            }).countDocuments();
            // gen studentId = yoa + index
            const studentId = `${yoa}${numberOfStudentWithYoa
                .toString()
                .padStart(numberOfSuffix, '0')}`;
            // gen email studentId + @hust.edu.vn
            const studentEmail = `${studentId}@hust.edu.vn`;
            // gen password
            const passLen = 8;
            const password = require('crypto')
                .randomBytes(passLen)
                .toString('hex');
            //create account
            const newAcc = await post(
                process.env.AUTH_URL as string,
                '/create',
                { email: studentEmail, password, role: 2 },
                {
                    headers: {
                        authorization: req.headers['authorization'] as string,
                    },
                },
            );
            console.log(newAcc);
            console.log(`Create account ${studentEmail + '_' + password} done`);

            // create user
            const studentJson = { yoa, email, studentId, ...otherFields };
            studentJson.accountId = newAcc._id;
            const newStudent = new StudentModel(studentJson);
            await newStudent.save();
            console.log('Create user done');
            // send email to student
            // TODO
            res.send({
                msg: `Add new Student with email ${studentEmail} successfully`,
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const inforFields = req.body; // Pass the body directly
            const newStudent = new StudentModel(inforFields);
            await newStudent.save();
            res.send({
                msg: `Add new Student with id = ${inforFields.studentId} successfully`,
            });
        } catch (err) {
            console.error(err); // Log the error for debugging
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

    // [GET] /find
    async find(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query; // Lấy các query params từ request
            const students = await StudentModel.find(query); // Sử dụng query params để tìm tài liệu

            if (students.length === 0) {
                res.send({ msg: 'No students found matching the query' });
                return;
            }

            res.send(students); // Trả về danh sách các tài liệu
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
        console.log(error);
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

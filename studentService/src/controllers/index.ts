import { Request, Response, NextFunction } from 'express';
import StudentModel from '../models/student';
import { post, get, del } from '../utils/httpRequests';
import axios from 'axios';

function nameToPrefix(input: string) {
    const words = input.split(' '); // Tách chuỗi thành mảng
    const lastWord = words.pop(); // Lấy phần tử cuối
    const restWords = words.map((word) => word.charAt(0)).join(''); // Lấy ký tự đầu của các từ còn lại
    return `${lastWord}.${restWords}`.toLowerCase(); // Kết hợp lại theo định dạng yêu cầu
}

class StudentController {
    // [POST] /register/:numberOfSuffix
    async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        console.log('Start register');
        let accountCreated = false;
        let userCreated = false;
        let studentEmail;
        let studentId;
        try {
            const numberOfSuffix = parseInt(req.params.numberOfSuffix);
            const { yoa, email, ...otherFields } = req.body;
            // fetch current number of student with same yoa
            const numberOfStudentWithYoa = await StudentModel.where({
                yoa,
            }).countDocuments();
            // gen studentId = yoa + index
            studentId = `${yoa}${numberOfStudentWithYoa
                .toString()
                .padStart(numberOfSuffix, '0')}`;
            // gen email studentId + @hust.edu.vn
            studentEmail = `${nameToPrefix(
                otherFields.fullName,
            )}${studentId}@hust.edu.vn`;
            // gen password
            const passLen = 8;
            const password = require('crypto')
                .randomBytes(passLen)
                .toString('hex');
            //create account
            const newAcc = await post(
                process.env.AUTH_URL as string,
                '/create',
                { email: studentEmail, password, role: 3 },
                {
                    headers: {
                        authorization: req.headers['authorization'] as string,
                    },
                },
            );
            accountCreated = true;
            console.log(`Create account ${studentEmail + '_' + password} done`);

            // create user
            const studentJson = { yoa, email, studentId, ...otherFields };
            studentJson.accountId = newAcc._id;
            const newStudent = new StudentModel(studentJson);
            await newStudent.save();
            userCreated = true;
            console.log('Create user done');
            // send email to student
            // TODO
            res.send({
                msg: `Add new Student with email ${studentEmail} successfully`,
            });
        } catch (err) {
            if (accountCreated) {
                await del(
                    process.env.AUTH_URL as string,
                    `/delete/${studentEmail}`,
                    {
                        headers: {
                            authorization: req.headers[
                                'authorization'
                            ] as string,
                        },
                    },
                );
            }
            if (userCreated) {
                await StudentModel.deleteOne({ studentId });
            }
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

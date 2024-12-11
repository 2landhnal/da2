import { Request, Response, NextFunction } from 'express';
import TeacherModel from '../models/teacher';
import { post, get, del } from '../utils/httpRequests';
import axios from 'axios';

function nameToPrefix(input: string) {
    const words = input.split(' '); // Tách chuỗi thành mảng
    const lastWord = words.pop(); // Lấy phần tử cuối
    const restWords = words.map((word) => word.charAt(0)).join(''); // Lấy ký tự đầu của các từ còn lại
    return `${lastWord}.${restWords}`.toLowerCase(); // Kết hợp lại theo định dạng yêu cầu
}

class TeacherController {
    // [POST] /register/:numberOfSuffix
    async register(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        console.log('Start register');
        let accountCreated = false;
        let userCreated = false;
        let teacherEmail;
        let teacherId;
        try {
            const numberOfSuffix = parseInt(req.params.numberOfSuffix);
            const { yoj, email, ...otherFields } = req.body;
            // fetch current number of teacher with same yoj
            const numberOfteacherWithyoj = await TeacherModel.where({
                yoj,
            }).countDocuments();
            // gen teacherId = yoj + index
            teacherId = `${yoj}${numberOfteacherWithyoj
                .toString()
                .padStart(numberOfSuffix, '0')}`;
            // gen email teacherId + @hust.edu.vn
            teacherEmail = `${nameToPrefix(
                otherFields.fullName,
            )}${teacherId}@hust.edu.vn`;
            // gen password
            const passLen = 8;
            const password = require('crypto')
                .randomBytes(passLen)
                .toString('hex');
            //create account
            const newAcc = await post(
                process.env.AUTH_URL as string,
                '/create',
                { email: teacherEmail, password, role: 2 },
                {
                    headers: {
                        authorization: req.headers['authorization'] as string,
                    },
                },
            );
            accountCreated = true;
            console.log(`Create account ${teacherEmail + '_' + password} done`);

            // create user
            const teacherJson = { yoj, email, teacherId, ...otherFields };
            teacherJson.accountId = newAcc._id;
            const newteacher = new TeacherModel(teacherJson);
            await newteacher.save();
            userCreated = true;
            console.log('Create user done');
            // send email to teacher
            // TODO
            res.send({
                msg: `Add new teacher with email ${teacherEmail} successfully`,
            });
        } catch (err) {
            if (accountCreated) {
                await del(
                    process.env.AUTH_URL as string,
                    `/delete/${teacherEmail}`,
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
                await TeacherModel.deleteOne({ teacherId });
            }
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

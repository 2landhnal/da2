'use strict';
import StudentValidate from '../validate/student.validate.js';
import { HelpService } from './help.service.js';
import { sendToQueue } from '../config/messageQueue/connect.js';
import {
    pushToList,
    valueExistsInList,
    valueExistInHashedList,
    removeRefreshToken,
    saveRefreshToken,
    isRefreshTokenValid,
    incr,
} from '../models/repositories/redis.repo.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import {
    createStudent,
    findStudentWithPersonalEmail,
    findStudentWithUid,
    queryStudent,
    deleteStudentByUid,
    getNumberOfStudentWithYoa,
    updateStudentInfor,
} from '../models/repositories/student.repo.js';
import { getInfoData } from '../utils/index.js';
import { AccountStatus } from '../utils/accountStatus.js';
import { NUMBER_OF_SUFFIX_STUDENT_ID } from '../config/const.config.js';
import { nameToPrefix } from '../helpers/student.helper.js';
import { RoleCode } from '../utils/roleCode.js';
import { gRPCAuthClient } from '../config/gRPC/auth.grpc.client.js';
import { tryGetFromCache } from '../utils/redis.utils.js';
import {
    studentKey,
    studentsKey,
    numberOfStudentWithYoaKey,
} from '../config/redis/redis.config.js';
import { FirebaseRepo } from '../models/repositories/firebase.repo.js';
import { MqService } from './mq.service.js';

export class StudentService {
    static register = async ({
        fullname,
        personalEmail,
        yoa,
        phone,
        address,
        dob,
        gender,
        avatar,
        ...otherInfors
    }) => {
        const userInput = {
            fullname,
            personalEmail,
        };
        yoa = yoa || new Date().getFullYear();

        // validate userInput
        const { error, value } =
            StudentValidate.studentRegisterSchema.validate(userInput);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        if (avatar) {
            const { error, value } = StudentValidate.fileSchema.validate({
                file: avatar,
            });
            if (error) {
                throw new BadRequestError(error.details[0].message);
            }
        }

        const numberOfStudentWithYoa = await tryGetFromCache(
            numberOfStudentWithYoaKey.key(yoa),
            numberOfStudentWithYoaKey.expireTimeInMinute,
            async () => {
                return await getNumberOfStudentWithYoa({ yoa });
            },
        );
        // gen studentId = yoa + index
        const uid = `${yoa}${numberOfStudentWithYoa
            .toString()
            .padStart(NUMBER_OF_SUFFIX_STUDENT_ID, '0')}`;
        // gen email studentId + @hust.edu.vn
        const email = `${nameToPrefix(fullname)}${uid}@hust.std.vn`;
        // gen password
        // const passLen = 8;
        // const password = require('crypto').randomBytes(passLen).toString('hex');

        const newStudent = await createStudent({
            uid,
            email,
            personalEmail,
            fullname,
            yoa,
            phone,
            address,
            dob,
            gender,
            ...otherInfors,
        });

        console.log('Create student done, messaging to create account');
        // GRPC:
        const role = RoleCode.STUDENT;
        const infor = JSON.stringify({
            email,
            uid,
            role,
        });

        let creatAccountOkey = (await gRPCAuthClient.createAccount({ infor }))
            .ok;
        if (!creatAccountOkey) {
            sendToQueue('student_delete', JSON.stringify({ uid }));
            sendToQueue('account_delete', JSON.stringify({ email }));
            throw new BadRequestError();
        }
        // upload avatar via mq
        if (avatar) {
            MqService.uploadAvatar({ avatar, uid });
        } else {
            sendToQueue(
                'sync_infor',
                JSON.stringify({
                    role: RoleCode.STUDENT,
                    ...newStudent.toObject(),
                }),
            );
        }

        // incr
        incr(numberOfStudentWithYoaKey.key(yoa));
        return { newStudent };
    };

    static search = async ({ page, resultPerPage, query, header_role }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);

        // query
        let students;
        students = await tryGetFromCache(
            studentsKey.key(page, resultPerPage, query),
            studentsKey.expireTimeInMinute,
            async () => {
                return await queryStudent({ page, resultPerPage, query });
            },
        );

        // filter
        students = students.map((student) => {
            if (header_role != RoleCode.BCTSV) {
                return getInfoData({
                    fileds: ['uid', 'fullname', 'yoa', 'email', 'avatar'],
                    object: student,
                });
            }
            return student;
        });
        return {
            students,
            pagination: {
                page,
                resultPerPage,
                totalResults: students.length,
            },
        };
    };

    static syncInfor = async () => {
        // validate
        const page = 1;
        const resultPerPage = 100000;
        const query = {};

        // query
        let students;
        students = await tryGetFromCache(
            studentsKey.key(page, resultPerPage, query),
            studentsKey.expireTimeInMinute,
            async () => {
                return await queryStudent({ page, resultPerPage, query });
            },
        );

        // loop
        students = students.forEach((student) => {
            sendToQueue(
                'sync_infor',
                JSON.stringify({
                    role: RoleCode.STUDENT,
                    ...student.toObject(),
                }),
            );
        });
        return {};
    };

    static findByUid = async ({ uid, header_role, header_uid }) => {
        // let student = await findStudentWithUid({ uid });
        let student = await tryGetFromCache(
            studentKey.key(uid),
            studentKey.expireTimeInMinute,
            async () => {
                return await findStudentWithUid({ uid });
            },
        );
        const auth =
            header_role === RoleCode.BCTSV ||
            (header_role === RoleCode.STUDENT && header_uid === uid);
        if (!auth) {
            student = getInfoData({
                fileds: ['uid', 'fullname', 'yoa', 'email', 'avatar'],
                object: student,
            });
        }
        // remove from cookie
        return { student };
    };

    static update = async ({ uid, header_role, header_uid, ...updates }) => {
        const auth =
            header_role === RoleCode.BCTSV ||
            (header_role === RoleCode.STUDENT && header_uid === uid);
        if (!auth) {
            throw new AuthFailureError();
        }
        updates = getInfoData({
            fileds: [
                'fullname',
                'personalEmail',
                'yoa',
                'phone',
                'address',
                'dob',
                'gender',
                'avatar',
            ],
            object: updates,
        });
        let student = await findStudentWithUid({ uid });
        if (!student) {
            throw new BadRequestError('Student not exist');
        }
        student = await updateStudentInfor({
            uid,
            ...updates,
        });
        sendToQueue(
            'sync_infor',
            JSON.stringify({ role: RoleCode.STUDENT, ...student.toObject() }),
        );
        return { student };
    };

    static changeAvatar = async ({ file, uid, header_role, header_uid }) => {
        console.log({ header_role, header_uid });
        // authorize
        const auth =
            header_role === RoleCode.BCTSV ||
            (header_role === RoleCode.STUDENT && header_uid === uid);
        if (!auth) {
            throw new AuthFailureError();
        }
        // validate file
        const { error, value } = StudentValidate.fileSchema.validate({ file });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        // check user exist
        const student = await tryGetFromCache(
            studentKey.key(uid),
            studentsKey.expireTimeInMinute,
            async () => {
                return await findStudentWithUid({ uid });
            },
        );
        if (!student) {
            throw new BadRequestError(`Student with id ${uid} not existed`);
        }
        MqService.uploadAvatar({ avatar: file, uid });
        return {};
    };
}

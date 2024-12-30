'use strict';
import StudentValidate from '../validate/student.validate.js';
import bcrypt from 'bcryptjs';
import { authClient } from '../config/gRPC/auth.grpc.client.js';

import { sendToQueue } from '../config/messageQueue/connect.js';
import {
    pushToList,
    valueExistsInList,
    valueExistInHashedList,
    removeRefreshToken,
    saveRefreshToken,
    isRefreshTokenValid,
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
import jwt from 'jsonwebtoken';
import { AccountStatus } from '../utils/accountStatus.js';
import { NUMBER_OF_SUFFIX_STUDENT_ID } from '../config/const.config.js';
import { nameToPrefix } from '../helpers/student.helper.js';
import Student from '../models/student.model.js';
import { RoleCode } from '../utils/roleCode.js';
import { createAccount } from '../config/gRPC/auth.grpc.client.js';

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

        const numberOfStudentWithYoa = await getNumberOfStudentWithYoa({ yoa });
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
            avatar,
        });

        console.log('Create student done, messaging to create account');
        // GRPC:
        const role = RoleCode.STUDENT;
        const infor = JSON.stringify({
            email,
            uid,
            role,
            personalEmail,
        });

        await createAccount({ infor });

        return { newStudent };
    };

    static search = async ({ page, resultPerPage, query, header_role }) => {
        // validate
        page = page || 1;
        resultPerPage = resultPerPage || 10;

        // query
        let students = await queryStudent({ page, resultPerPage, query });

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

    static findByUid = async ({ uid, header_role, header_uid }) => {
        let student = await findStudentWithUid({ uid });
        if (header_role !== RoleCode.BCTSV && uid !== header_uid) {
            student = getInfoData({
                fileds: ['uid', 'fullname', 'yoa', 'email', 'avatar'],
                object: student,
            });
        }
        // remove from cookie
        return { student };
    };

    static update = async ({ uid, header_role, header_uid, ...updates }) => {
        if (header_role !== RoleCode.BCTSV && uid !== header_uid) {
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
        let student = await updateStudentInfor({ uid, ...updates });
        return { student };
    };
}

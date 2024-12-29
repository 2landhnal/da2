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
} from '../models/repositories/student.repo.js';
import { getInfoData } from '../utils/index.js';
import jwt from 'jsonwebtoken';
import { AccountStatus } from '../utils/accountStatus.js';
import { NUMBER_OF_SUFFIX_STUDENT_ID } from '../config/const.config.js';
import { nameToPrefix } from '../helpers/student.helper.js';
import Student from '../models/student.model.js';
import { RoleCode } from '../utils/roleCode.js';

export class AuthService {
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
        const password = 'Abc123456$';
        const role = RoleCode.STUDENT;
        const infor = JSON.stringify({
            email,
            password,
            uid,
            role,
            personalEmail,
        });
        await authClient.createAccount({ infor }, (err, response) => {
            if (err) {
                console.log(err);
                // MQ: delete student by uid
                sendToQueue('student_delete', 'Delete student request from me');
                // throw new BadRequestError(err);
            } else {
                // MQ: delete student by uid
                sendToQueue('noti_send', 'Noti request from me');
                console.log(`From server`, JSON.stringify(response));
            }
        });

        return { newStudent };
    };

    static search = async ({ page, resultPerPage, query }) => {
        const result = await queryStudent({ page, resultPerPage, query });
        // remove from cookie
        return result;
    };
}

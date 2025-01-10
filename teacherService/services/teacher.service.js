'use strict';
import TeacherValidate from '../validate/teacher.validate.js';
import { sendToQueue } from '../config/messageQueue/connect.js';
import { TeacherRepo } from '../models/repositories/teacher.repo.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { getInfoData } from '../utils/index.js';
import { NUMBER_OF_SUFFIX_TEACHER_ID } from '../config/const.config.js';
import { nameToPrefix } from '../helpers/student.helper.js';
import { RoleCode } from '../utils/roleCode.js';
import { gRPCAuthClient } from '../config/gRPC/auth.grpc.client.js';
import { tryGetFromCache } from '../utils/redis.utils.js';
import { teacherKey, teachersKey } from '../config/redis/redis.config.js';
import { FirebaseRepo } from '../models/repositories/firebase.repo.js';
import { TmpRepo } from '../models/repositories/tmp.repo.js';
import { MqService } from './mq.service.js';

export class TeacherService {
    static register = async ({
        fullname,
        personalEmail,
        yoj,
        phone,
        address,
        dob,
        gender,
        avatar,
        degree,
    }) => {
        const userInput = {
            fullname,
            personalEmail,
            yoj,
            phone,
            address,
            dob,
            gender,
            avatar,
            degree,
        };
        yoj = yoj || new Date().getFullYear();

        // validate userInput
        const { error, value } =
            TeacherValidate.teacherRegisterSchema.validate(userInput);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        if (avatar) {
            const { error, value } = TeacherValidate.fileSchema.validate({
                file: avatar,
            });
            if (error) {
                throw new BadRequestError(error.details[0].message);
            }
        }

        const numberOfTeacherWithYoj =
            await TeacherRepo.getNumberOfTeacherWithYoj({ yoj });
        // gen teacherId = yoj + index
        const uid = `${yoj}${numberOfTeacherWithYoj
            .toString()
            .padStart(NUMBER_OF_SUFFIX_TEACHER_ID, '0')}`;
        // gen email teacherId + @hust.edu.vn
        const email = `${nameToPrefix(fullname)}${uid}@hust.tch.vn`;
        // gen password
        // const passLen = 8;
        // const password = require('crypto').randomBytes(passLen).toString('hex');

        const newTeacher = await TeacherRepo.createTeacher({
            uid,
            email,
            fullname,
            personalEmail,
            yoj,
            phone,
            address,
            dob,
            gender,
            degree,
        });

        console.log('Create teacher done, messaging to create account');
        // GRPC:
        const role = RoleCode.TEACHER;
        const infor = JSON.stringify({
            email,
            uid,
            role,
        });

        let creatAccountOkey = (await gRPCAuthClient.createAccount({ infor }))
            .ok;
        if (!creatAccountOkey) {
            sendToQueue('teacher_delete', JSON.stringify({ uid }));
            throw new BadRequestError();
        }
        // upload avatar via mq
        if (avatar) {
            MqService.uploadAvatar({ avatar, uid });
        } else {
            sendToQueue(
                'sync_infor',
                JSON.stringify({
                    role: RoleCode.TEACHER,
                    ...newTeacher.toObject(),
                }),
            );
        }

        return { newTeacher };
    };

    static search = async ({ page, resultPerPage, query, header_role }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);

        // query
        let teachers;
        teachers = await tryGetFromCache(
            teachersKey.key(page, resultPerPage, query),
            teachersKey.expireTimeInMinute,
            async () => {
                return await TeacherRepo.queryTeacher({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        // filter
        teachers = teachers.map((teacher) => {
            if (header_role != RoleCode.BTCNS) {
                return getInfoData({
                    fileds: [
                        'uid',
                        'fullname',
                        'yoj',
                        'email',
                        'avatar',
                        'degree',
                    ],
                    object: teacher,
                });
            }
            return teacher;
        });
        return {
            teachers,
            pagination: {
                page,
                resultPerPage,
                totalResults: teachers.length,
            },
        };
    };

    static findByUid = async ({ uid, header_role, header_uid }) => {
        // let teacher = await findTeacherWithUid({ uid });
        let teacher = await tryGetFromCache(
            teacherKey.key(uid),
            teacherKey.expireTimeInMinute,
            async () => {
                return await TeacherRepo.findTeacherWithUid({ uid });
            },
        );
        const auth =
            header_role === RoleCode.BTCNS ||
            (header_role === RoleCode.TEACHER && uid === header_uid);
        if (!auth) {
            teacher = getInfoData({
                fileds: ['uid', 'fullname', 'yoj', 'email', 'avatar', 'degree'],
                object: teacher,
            });
        }
        // remove from cookie
        return { teacher };
    };

    static update = async ({ uid, header_role, header_uid, ...updates }) => {
        const auth =
            header_role === RoleCode.BTCNS ||
            (header_role === RoleCode.TEACHER && uid === header_uid);
        if (auth !== true) {
            throw new AuthFailureError();
        }
        updates = getInfoData({
            fileds: [
                'fullname',
                'personalEmail',
                'yoj',
                'phone',
                'address',
                'dob',
                'gender',
                'avatar',
                'degree',
            ],
            object: updates,
        });
        let teacher = await TeacherRepo.findTeacherWithUid({ uid });
        if (!teacher) {
            throw new BadRequestError('Teacher not exist');
        }
        teacher = await TeacherRepo.updateTeacherInfor({
            uid,
            ...updates,
        });
        teacher = { role: RoleCode.TEACHER, ...teacher.toObject() };
        sendToQueue('sync_infor', JSON.stringify(teacher));
        return { teacher };
    };

    static changeAvatar = async ({ file, uid, header_role, header_uid }) => {
        // authorize
        const auth =
            header_role === RoleCode.BTCNS ||
            (header_role === RoleCode.TEACHER && uid === header_uid);
        if (!auth) {
            throw new AuthFailureError();
        }
        // validate file
        const { error, value } = TeacherValidate.fileSchema.validate({ file });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
        // check user exist
        const teacher = await tryGetFromCache(
            teacherKey.key(uid),
            teachersKey.expireTimeInMinute,
            async () => {
                return await TeacherRepo.findTeacherWithUid({ uid });
            },
        );
        if (!teacher) {
            throw new BadRequestError(`Teacher with id ${uid} not existed`);
        }

        const fileExtension = file.originalname.split('.').pop();
        const pathToSave = `avatar/teacher/${uid}.${fileExtension}`;
        const { fileUpload, publicUrl } = await FirebaseRepo.uploadFile({
            pathToSave,
            file,
        });
        sendToQueue(
            'teacher_changeAvatarUrl',
            JSON.stringify({ avatar: publicUrl, header_role, header_uid, uid }),
        );
        return { publicUrl };
    };
}

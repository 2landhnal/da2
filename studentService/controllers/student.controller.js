'use strict';
import { CREATED, OK, SuccessResponse } from '../responses/success.response.js';
import { StudentService } from '../services/student.service.js';
import { REFRESHTOKEN_COOKIE_TIME } from '../config/const.config.js';
import { HEADER } from '../middlewares/auth.middleware.js';
class StudentController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'Registered successfully!',
            metadata: await StudentService.register({
                avatar: req.file,
                ...req.body,
            }),
        }).send(res);
    };

    search = async (req, res, next) => {
        const metadata = await StudentService.search({
            ...req.query,
            header_role: req.header_role,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    syncInfor = async (req, res, next) => {
        const metadata = await StudentService.syncInfor();
        new SuccessResponse({
            message: 'Sync successfully!',
            metadata,
        }).send(res);
    };

    findByUid = async (req, res, next) => {
        const metadata = await StudentService.findByUid({
            ...req.params,
            header_role: req.header_role,
            header_uid: req.header_uid,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await StudentService.update({
                ...req.body,
                header_role: req.header_role,
                header_uid: req.header_uid,
            }),
        }).send(res);
    };

    changeAvatar = async (req, res, next) => {
        new OK({
            message: 'Change avatar successfully!',
            metadata: await StudentService.changeAvatar({
                ...req.body,
                header_role: req.header_role,
                header_uid: req.header_uid,
                file: req.file,
            }),
        }).send(res);
    };
}

export const studentController = new StudentController();

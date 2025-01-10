'use strict';
import { CREATED, OK, SuccessResponse } from '../responses/success.response.js';
import { TeacherService } from '../services/teacher.service.js';

class TeacherController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'Registered successfully!',
            metadata: await TeacherService.register({
                avatar: req.file,
                ...req.body,
            }),
        }).send(res);
    };

    search = async (req, res, next) => {
        const metadata = await TeacherService.search({
            header_role: req.header_role,
            ...req.query,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    findByUid = async (req, res, next) => {
        const metadata = await TeacherService.findByUid({
            header_role: req.header_role,
            header_uid: req.header_uid,
            ...req.params,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await TeacherService.update({
                header_role: req.header_role,
                header_uid: req.header_uid,
                ...req.body,
            }),
        }).send(res);
    };

    changeAvatar = async (req, res, next) => {
        new OK({
            message: 'Change avatar successfully!',
            metadata: await TeacherService.changeAvatar({
                header_role: req.header_role,
                header_uid: req.header_uid,
                file: req.file,
                ...req.body,
            }),
        }).send(res);
    };
}

export const teacherController = new TeacherController();

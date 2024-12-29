'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { StudentService } from '../services/student.service.js';
import { REFRESHTOKEN_COOKIE_TIME } from '../config/const.config.js';
import { HEADER } from '../middlewares/auth.middleware.js';
class StudentController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'Registered successfully!',
            metadata: await StudentService.register(req.body),
        }).send(res);
    };

    search = async (req, res, next) => {
        const role = req.headers[HEADER.ROLE];
        const metadata = await StudentService.search({ ...req.body, role });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    findByUid = async (req, res, next) => {
        const role = req.headers[HEADER.ROLE];
        const metadata = await StudentService.findByUid({
            ...req.params,
            role,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };
}

export const studentController = new StudentController();

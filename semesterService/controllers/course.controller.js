'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { CourseService } from '../services/course.service.js';
class CourseController {
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create course successfully!',
            metadata: await CourseService.create(req.body),
        }).send(res);
    };

    search = async (req, res, next) => {
        const metadata = await CourseService.search(req.query);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    findById = async (req, res, next) => {
        const metadata = await CourseService.findById(req.params);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    closeById = async (req, res, next) => {
        const metadata = await CourseService.closeById(req.params);
        new SuccessResponse({
            message: 'Close course successfully!',
            metadata,
        }).send(res);
    };

    update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await CourseService.update(req.body),
        }).send(res);
    };
}

export const courseController = new CourseController();

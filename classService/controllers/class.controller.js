'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { ClassService } from '../services/class.service.js';
export class ClassController {
    static create = async (req, res, next) => {
        new CREATED({
            message: 'Create successfully!',
            metadata: await ClassService.create(req.body),
        }).send(res);
    };

    static search = async (req, res, next) => {
        const metadata = await ClassService.search(req.query);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static syncInfor = async (req, res, next) => {
        const metadata = await ClassService.syncInfor();
        new SuccessResponse({
            message: 'Sync successfully!',
            metadata,
        }).send(res);
    };

    static findById = async (req, res, next) => {
        const metadata = await ClassService.findById(req.params);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static getOpenCourses = async (req, res, next) => {
        const metadata = await ClassService.findOpenCourseInSemester(
            req.params,
        );
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await ClassService.update(req.body),
        }).send(res);
    };

    static finish = async (req, res, next) => {
        new CREATED({
            message: 'Finish class enroll successfully!',
            metadata: await ClassService.finish(req.body),
        }).send(res);
    };
}

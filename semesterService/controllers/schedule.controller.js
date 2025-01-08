'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { ScheduleService } from '../services/schedule.service.js';
export class ScheduleController {
    static create = async (req, res, next) => {
        new CREATED({
            message: 'Create schedule successfully!',
            metadata: await ScheduleService.create(req.body),
        }).send(res);
    };

    static search = async (req, res, next) => {
        const metadata = await ScheduleService.search(req.query);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static findById = async (req, res, next) => {
        const metadata = await ScheduleService.findById(req.params);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update information successfully!',
            metadata: await ScheduleService.update(req.body),
        }).send(res);
    };

    static findSchedulesBySemester = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully!',
            metadata: await ScheduleService.findSchedulesBySemester(req.params),
        }).send(res);
    };

    static findAvailableSchedules = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully!',
            metadata: await ScheduleService.findAvailableSchedules(),
        }).send(res);
    };

    static checkAccess = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully!',
            metadata: await ScheduleService.checkAccess(req.params),
        }).send(res);
    };
}

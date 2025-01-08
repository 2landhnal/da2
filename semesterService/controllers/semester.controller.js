'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { SemesterService } from '../services/semester.service.js';
export class SemesterController {
    static create = async (req, res, next) => {
        new CREATED({
            message: 'Create semester successfully!',
            metadata: await SemesterService.create(req.body),
        }).send(res);
    };

    static search = async (req, res, next) => {
        const metadata = await SemesterService.search(req.query);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static findById = async (req, res, next) => {
        const metadata = await SemesterService.findById(req.params);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await SemesterService.update(req.body),
        }).send(res);
    };
}

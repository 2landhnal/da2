'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { ShiftService } from '../services/shift.service.js';
export class ShiftController {
    static create = async (req, res, next) => {
        new CREATED({
            message: 'Create successfully!',
            metadata: await ShiftService.create(req.body),
        }).send(res);
    };

    static search = async (req, res, next) => {
        const metadata = await ShiftService.search(req.query);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static findById = async (req, res, next) => {
        const metadata = await ShiftService.findById(req.params);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await ShiftService.update(req.body),
        }).send(res);
    };
}

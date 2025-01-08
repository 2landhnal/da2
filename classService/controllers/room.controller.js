'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { RoomService } from '../services/room.service.js';
export class RoomController {
    static create = async (req, res, next) => {
        new CREATED({
            message: 'Create successfully!',
            metadata: await RoomService.create(req.body),
        }).send(res);
    };

    static search = async (req, res, next) => {
        const metadata = await RoomService.search(req.query);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static findById = async (req, res, next) => {
        const metadata = await RoomService.findById(req.params);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    static closeById = async (req, res, next) => {
        const metadata = await RoomService.closeById(req.params);
        new SuccessResponse({
            message: 'Close successfully!',
            metadata,
        }).send(res);
    };

    static activeById = async (req, res, next) => {
        const metadata = await RoomService.activeById(req.params);
        new SuccessResponse({
            message: 'Active successfully!',
            metadata,
        }).send(res);
    };

    static update = async (req, res, next) => {
        new CREATED({
            message: 'Update information successfully!',
            metadata: await RoomService.update(req.body),
        }).send(res);
    };
}

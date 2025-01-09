'use strict';
import RoomValidate from '../validate/room.validate.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { RoomRepo } from '../models/repositories/room.repo.js';
import { getInfoData } from '../utils/index.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import { roomKey, roomsKey } from '../config/redis/redis.config.js';

export class RoomService {
    static create = async ({ id, maxCapacity, status }) => {
        // validate
        const { error, value } = RoomValidate.roomSchema.validate({
            id,
            maxCapacity,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        const hoddedRoom = await RoomRepo.findRoomById({ id });
        if (hoddedRoom) {
            throw new BadRequestError('Room id existed');
        }

        const room = await RoomRepo.createRoom({ id, maxCapacity, status });
        return { room };
    };

    static search = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);
        console.log(query);

        // query
        let rooms;
        rooms = await tryGetFromCache(
            roomsKey.key(page, resultPerPage, query),
            roomsKey.expireTimeInMinute,
            async () => {
                return await RoomRepo.queryRoom({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        return {
            rooms,
            pagination: {
                page,
                resultPerPage,
                totalResults: rooms.length,
            },
        };
    };

    static findById = async ({ id }) => {
        // let student = await findStudentWithUid({ uid });
        let room = await tryGetFromCache(
            roomKey.key(id),
            roomKey.expireTimeInMinute,
            async () => {
                return await RoomRepo.findRoomById({ id });
            },
        );
        return { room };
    };

    static update = async ({ id, maxCapacity, status }) => {
        // validate
        const { error, value } = RoomValidate.roomSchema.validate({
            id,
            maxCapacity,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        let room = await RoomRepo.updateRoomInfor({ id, maxCapacity, status });

        return { room };
    };

    static closeById = async ({ id }) => {
        // validate
        const hoodedRoom = await RoomRepo.findRoomById({ id });
        if (!hoodedRoom) {
            throw new BadRequestError('Room not existed');
        }

        const room = await RoomRepo.closeRoomById({ id });
        return { room };
    };

    static activeById = async ({ id }) => {
        // validate
        const hoodedRoom = await RoomRepo.findRoomById({ id });
        if (!hoodedRoom) {
            throw new BadRequestError('Room not existed');
        }

        const room = await RoomRepo.activeRoomById({ id });
        return { room };
    };
}

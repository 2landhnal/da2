'use strict';
import ShiftValidate from '../validate/shift.validate.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { ShiftRepo } from '../models/repositories/shift.repo.js';
import { getInfoData } from '../utils/index.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import { shiftKey, shiftsKey } from '../config/redis/redis.config.js';

export class ShiftService {
    static create = async ({ id, startAt, endAt }) => {
        // validate
        const { error, value } = ShiftValidate.shiftSchema.validate({
            id,
            startAt,
            endAt,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        const hoddedShift = await ShiftRepo.findShiftById({ id });
        if (hoddedShift) {
            throw new BadRequestError('Shift id existed');
        }

        const shift = await ShiftRepo.createShift({ id, startAt, endAt });
        return { shift };
    };

    static search = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);
        console.log(query);

        // query
        let shifts;
        shifts = await tryGetFromCache(
            shiftsKey.key(page, resultPerPage, query),
            shiftsKey.expireTimeInMinute,
            async () => {
                return await ShiftRepo.queryShift({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        return {
            shifts,
            pagination: {
                page,
                resultPerPage,
                totalResults: shifts.length,
            },
        };
    };

    static findById = async ({ id }) => {
        // let student = await findStudentWithUid({ uid });
        let shift = await tryGetFromCache(
            shiftKey.key(id),
            shiftKey.expireTimeInMinute,
            async () => {
                return await ShiftRepo.findShiftById({ id });
            },
        );
        return { shift };
    };

    static update = async ({ id, startAt, endAt }) => {
        // validate
        const { error, value } = ShiftValidate.shiftSchema.validate({
            id,
            startAt,
            endAt,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        let shift = await ShiftRepo.updateShiftInfor({ id, startAt, endAt });

        return { shift };
    };
}

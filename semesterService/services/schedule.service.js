'use strict';
import ScheduleValidate from '../validate/schedule.validate.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { ScheduleRepo } from '../models/repositories/schedule.repo.js';
import { SemesterRepo } from '../models/repositories/semester.repo.js';
import { getInfoData } from '../utils/index.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import {
    registrationScheduleKey,
    registrationSchedulesKey,
} from '../config/redis/redis.config.js';
import { SemesterStatus } from '../utils/semesterStatus.js';

export class ScheduleService {
    static create = async ({ semesterId, startDate, endDate, timeSlots }) => {
        timeSlots = timeSlots || [];
        let id = await ScheduleRepo.countScheduleWithSemesterId({
            semesterId,
        });
        id = String(id);
        // validate
        let { error, value } = ScheduleValidate.scheduleSchema.validate({
            id,
            startDate,
            endDate,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        // sequence validate
        if (startDate >= endDate) {
            throw new BadRequestError('Sequence time error');
        }

        // timeslot validate
        timeSlots.forEach((timeSlot) => {
            const { e, v } = ScheduleValidate.timeSlotSchema.validate(timeSlot);
            if (e) {
                throw new BadRequestError(e.details[0].message);
            }
        });

        // check existed
        const hoddedSemester = await SemesterRepo.findSemesterWithId({
            id: semesterId,
        });
        if (!hoddedSemester) {
            throw new BadRequestError('Semester id not existed');
        }

        // check semester closed
        if (hoddedSemester.status === SemesterStatus.CLOSED) {
            throw new BadRequestError('Semester closed');
        }

        // check overlap with semester
        if (hoddedSemester.startDate <= endDate) {
            throw new BadRequestError('Overlap schedule with semester');
        }

        // check existed
        const hoddedSchedule = await ScheduleRepo.findScheduleWithId({
            _id: `${semesterId}_${id}`,
        });
        if (hoddedSchedule) {
            throw new BadRequestError('Schedule _id existed');
        }

        const schedule = await ScheduleRepo.createSchedule({
            id,
            semesterId,
            startDate,
            endDate,
            timeSlots,
        });
        return { schedule };
    };

    static checkAccess = async ({ yoa }) => {
        let accessible = false;
        let semesterIds = [];
        // Lấy thời gian hiện tại (UTC)
        const now = new Date(); // UTC mặc định trong JavaScript

        // Lấy giờ và phút hiện tại
        const currentHour = now.getUTCHours();
        const currentMinute = now.getUTCMinutes();
        const currentTime = currentHour * 60 + currentMinute; // Giờ tính theo phút

        // Truy vấn các schedules hợp lệ
        const schedules = await ScheduleRepo.querySchedule({
            query: {
                startDate: { $lte: now },
                endDate: { $gte: now },
            },
        });

        console.log({ now });
        console.log({ schedules });

        if (!schedules.length) return { accessible, semesterIds }; // Không có lịch trình hợp lệ

        for (const schedule of schedules) {
            const validTimeSlots = schedule.timeSlots.filter((slot) => {
                const [startHour, startMinute] = slot.startAt
                    .split(':')
                    .map(Number);
                const [endHour, endMinute] = slot.endAt.split(':').map(Number);

                const startTime = startHour * 60 + startMinute;
                const endTime = endHour * 60 + endMinute;

                return currentTime >= startTime && currentTime <= endTime;
            });

            // Lấy semesterId nếu slot.allowance chứa id của bạn
            if (validTimeSlots.some((slot) => slot.allowance.includes(yoa))) {
                accessible = true;
                semesterIds.push(schedule.semesterId); // Giả định schedule có field semesterId
            }
        }
        return { accessible, semesterIds };
    };

    static findSchedulesBySemester = async ({ semesterId }) => {
        const schedules = await ScheduleRepo.findScheduleWithSemesterId({
            semesterId,
        });
        return { schedules };
    };

    static findAvailableSchedules = async () => {
        const schedules = await ScheduleRepo.findAvailableSchedules();
        return { schedules };
    };

    static search = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);

        // query
        let schedules;
        schedules = await tryGetFromCache(
            registrationSchedulesKey.key(page, resultPerPage, query),
            registrationSchedulesKey.expireTimeInMinute,
            async () => {
                return await ScheduleRepo.querySchedule({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        return {
            schedules,
            pagination: {
                page,
                resultPerPage,
                totalResults: schedules.length,
            },
        };
    };

    static findById = async ({ _id }) => {
        let schedule = await tryGetFromCache(
            registrationScheduleKey.key(_id),
            registrationScheduleKey.expireTimeInMinute,
            async () => {
                return await ScheduleRepo.findScheduleWithId({ _id });
            },
        );
        return { schedule };
    };

    static update = async ({ _id, startDate, endDate, timeSlots }) => {
        timeSlots = timeSlots || [];
        // validate
        let { error, value } = ScheduleValidate.scheduleSchema.validate({
            id: _id.split('_')[1],
            startDate,
            endDate,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        // sequence validate
        if (startDate >= endDate) {
            throw new BadRequestError('Sequence time error');
        }

        // timeslot validate
        timeSlots.forEach((timeSlot) => {
            console.log(timeSlot);
            const { error, value } =
                ScheduleValidate.timeSlotSchema.validate(timeSlot);
            if (error) {
                throw new BadRequestError(error.details[0].message);
            }
        });

        // check existed
        const hoddedSchedule = await ScheduleRepo.findScheduleWithId({
            _id,
        });
        if (!hoddedSchedule) {
            throw new BadRequestError(`Schedule with _id ${_id} not existed`);
        }

        // check overlap with semester
        const semester = await SemesterRepo.findSemesterWithId({
            id: hoddedSchedule.semesterId,
        });
        if (semester.startDate <= endDate) {
            throw new BadRequestError('Overlap schedule with semester');
        }

        let schedule = await ScheduleRepo.updateScheduleInfor({
            _id,
            startDate,
            endDate,
            timeSlots,
        });

        return { schedule };
    };
}

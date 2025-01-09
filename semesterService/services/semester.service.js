'use strict';
import SemesterValidate from '../validate/semester.validate.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { SemesterRepo } from '../models/repositories/semester.repo.js';
import { getInfoData } from '../utils/index.js';
import { RoleCode } from '../utils/roleCode.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import { semesterKey, semestersKey } from '../config/redis/redis.config.js';
import { ScheduleRepo } from '../models/repositories/schedule.repo.js';
import { SemesterStatus } from '../utils/semesterStatus.js';

export class SemesterService {
    static create = async ({ id, startDate, endDate, status, ...others }) => {
        // validate
        const { error, value } = SemesterValidate.semesterSchema.validate({
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

        // check id
        const hoddedSemester = await SemesterRepo.findSemesterWithId({ id });
        if (hoddedSemester) {
            throw new BadRequestError('Semester id existed');
        }

        // check overlap
        const overlapSemesters = await SemesterRepo.querySemester({
            query: {
                $or: [
                    {
                        startDate: { $lte: endDate, $gte: startDate }, // Start date nằm trong khoảng
                    },
                    {
                        endDate: { $lte: endDate, $gte: startDate }, // End date nằm trong khoảng
                    },
                    {
                        startDate: { $lte: startDate }, // Semester chứa toàn bộ khoảng thời gian
                        endDate: { $gte: endDate },
                    },
                ],
            },
        });
        if (overlapSemesters && overlapSemesters.length != 0) {
            throw new BadRequestError(
                `Semester overlaped: ${overlapSemesters}`,
            );
        }

        const semester = await SemesterRepo.createSemester({
            id,
            startDate,
            endDate,
            status,
            ...others,
        });
        return { semester };
    };

    static search = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);

        // query
        let semesters;
        semesters = await tryGetFromCache(
            semestersKey.key(page, resultPerPage, query),
            semestersKey.expireTimeInMinute,
            async () => {
                return await SemesterRepo.querySemester({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        return {
            semesters,
            pagination: {
                page,
                resultPerPage,
                totalResults: semesters.length,
            },
        };
    };

    static findById = async ({ id }) => {
        // let student = await findStudentWithUid({ uid });
        let semester = await tryGetFromCache(
            semesterKey.key(id),
            semesterKey.expireTimeInMinute,
            async () => {
                return await SemesterRepo.findSemesterWithId({ id });
            },
        );
        return { semester };
    };

    // static closeById = async ({ id }) => {
    //     // close
    //     const Semester = await Semes({ id });
    //     return { Semester };
    // };

    static update = async ({ id, startDate, endDate, status, ...others }) => {
        // validate
        const { error, value } = SemesterValidate.semesterSchema.validate({
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

        // check overlap
        let overlapSemesters = await SemesterRepo.querySemester({
            query: {
                $or: [
                    {
                        startDate: { $lte: endDate, $gte: startDate }, // Start date nằm trong khoảng
                    },
                    {
                        endDate: { $lte: endDate, $gte: startDate }, // End date nằm trong khoảng
                    },
                    {
                        startDate: { $lte: startDate }, // Semester chứa toàn bộ khoảng thời gian
                        endDate: { $gte: endDate },
                    },
                ],
            },
        });
        overlapSemesters = overlapSemesters.filter((sem) => {
            return sem.id != id;
        });
        if (overlapSemesters && overlapSemesters.length > 0) {
            throw new BadRequestError(
                `Semester overlaped: ${overlapSemesters}`,
            );
        }

        let semester = await SemesterRepo.updateSemesterInfor({
            id,
            startDate,
            endDate,
            status,
            ...others,
        });

        return { semester };
    };

    static checkActiveSemester = async () => {
        const now = Date.now();
        const semesters = await SemesterRepo.querySemester({
            query: {
                status: SemesterStatus.ACTIVE,
            },
        });
        semesters.forEach(async (semester) => {
            if (semester.endDate <= now) {
                await SemesterRepo.updateSemesterInfor({
                    id: semester.id,
                    status: SemesterStatus.CLOSED,
                });
                console.log(`Updated ${semester}`);
            }
        });
    };
    static checkClosedSemester = async () => {
        const now = Date.now();
        const semesters = await SemesterRepo.querySemester({
            query: {
                status: SemesterStatus.CLOSED,
            },
        });
        semesters.forEach(async (semester) => {
            if (semester.endDate > now) {
                await SemesterRepo.updateSemesterInfor({
                    id: semester.id,
                    status: SemesterStatus.ACTIVE,
                });
                console.log(`Updated ${semester}`);
            }
        });
    };
    static checkProcessingSemester = async () => {
        const now = Date.now();
        const semesters = await SemesterRepo.querySemester({
            query: {
                status: SemesterStatus.PROCESSING,
            },
        });
        semesters.forEach(async (semester) => {
            const schedules = await ScheduleRepo.findScheduleWithSemesterId({
                semesterId: semester.id,
            });
            schedules.forEach(async (schedule) => {
                if (schedule.startDate <= now && schedule.endDate >= now) {
                    await SemesterRepo.updateSemesterInfor({
                        id: semester.id,
                        status: SemesterStatus.OPEN_FOR_REGISTRATION,
                    });
                    console.log(`Updated ${semester}`);
                }
            });
            if (semester.startDate <= now) {
                await SemesterRepo.updateSemesterInfor({
                    id: semester.id,
                    status: SemesterStatus.ACTIVE,
                });
                console.log(`Updated ${semester}`);
            }
        });
    };
    static checkOpenForRegistrationSemester = async () => {
        const now = Date.now();
        const semesters = await SemesterRepo.querySemester({
            query: {
                status: SemesterStatus.OPEN_FOR_REGISTRATION,
            },
        });
        semesters.forEach(async (semester) => {
            const schedules = await ScheduleRepo.findScheduleWithSemesterId({
                semesterId: semester.id,
            });
            if (
                !schedules.some(
                    (schedule) =>
                        schedule.startDate <= now && schedule.endDate >= now,
                )
            ) {
                await SemesterRepo.updateSemesterInfor({
                    id: semester.id,
                    status: SemesterStatus.PROCESSING,
                });
                console.log(`Updated ${semester}`);
            }
        });
    };
}

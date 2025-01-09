'use strict';
import ClassValidate from '../validate/class.validate.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { ClassRepo } from '../models/repositories/class.repo.js';
import { getInfoData } from '../utils/index.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import {
    classKey,
    classesKey,
    coursesInSemesterKey,
} from '../config/redis/redis.config.js';
import { NUMBER_OF_SUFFIX_CLASS_ID } from '../../teacherService/config/const.config.js';
import { RoomRepo } from '../models/repositories/room.repo.js';
import ScheduleValidate from '../validate/schedule.validate.js';
import { CheckService } from './check.service.js';
import { gRPCTeacherClient } from '../config/gRPC/teacher.grpc.client.js';
import { gRPCCourseClient } from '../config/gRPC/course.grpc.client.js';
import { gRPCSemesterClient } from '../config/gRPC/semester.grpc.client.js';

export class ClassService {
    static create = async ({
        courseId,
        roomId,
        teacherId,
        semesterId,
        maxCapacity,
        schedule,
        teamCode,
        courseName,
        teacherName,
        currentEnroll,
    }) => {
        // validate
        const numberOfClass = await ClassRepo.countClass();
        const id = `${numberOfClass
            .toString()
            .padStart(NUMBER_OF_SUFFIX_CLASS_ID, '0')}`;
        const { error, value } = ClassValidate.classSchema.validate({
            id,
            courseId,
            roomId,
            teacherId,
            semesterId,
            maxCapacity,
            schedule,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // check schedule (start <= end)
        schedule.forEach((element) => {
            const { error, value } =
                ScheduleValidate.scheduleSchema.validate(element);
            if (error) {
                throw new BadRequestError(error.details[0].message);
            }
            if (element.startShift > element.endShift) {
                throw new BadRequestError('Schedule invalid');
            }
        });
        let infor;
        // check isTeacherActive
        infor = JSON.stringify({ uid: teacherId });
        if (
            !(await gRPCTeacherClient.isTeacherActive({ infor })).metadata
                .active
        ) {
            throw new BadRequestError('Teacher not available');
        }
        const teacher = (await gRPCTeacherClient.getTeacher({ infor })).metadata
            .teacher;

        // check isCourseActive
        infor = JSON.stringify({ id: courseId });
        if (
            !(await gRPCCourseClient.isCourseActive({ infor })).metadata.active
        ) {
            throw new BadRequestError('Course not available');
        }
        const course = (await gRPCCourseClient.getCourse({ infor })).metadata
            .course;

        // check isSemesterOkayToAddClass
        infor = JSON.stringify({ id: semesterId });
        if (
            !(await gRPCSemesterClient.isSemesterOkayToAddClass({ infor }))
                .metadata.okay
        ) {
            throw new BadRequestError('Semester not available');
        }
        // check isRoomExist
        const room = await RoomRepo.findRoomById({ id: roomId });
        if (!room) {
            throw new BadRequestError('Room not existed');
        }
        // check isRoomOverlap
        await CheckService.checkRoomOverlap({ roomId, schedule });
        // check isTeacherOverlap
        await CheckService.checkTeacherOverlap({ teacherId, schedule });

        const _class = await ClassRepo.createClass({
            id,
            courseId,
            roomId,
            teacherId,
            semesterId,
            maxCapacity,
            schedule,
            teamCode,
            courseName: course.name,
            teacherName: teacher.fullname,
            currentEnroll,
        });
        return { class: _class };
    };

    static search = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);
        console.log(query);

        // query
        let classs;
        classs = await tryGetFromCache(
            classesKey.key(page, resultPerPage, query),
            classesKey.expireTimeInMinute,
            async () => {
                return await ClassRepo.queryClass({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        return {
            classs,
            pagination: {
                page,
                resultPerPage,
                totalResults: classs.length,
            },
        };
    };

    static findById = async ({ id }) => {
        // let student = await findStudentWithUid({ uid });
        let _class = await tryGetFromCache(
            classKey.key(id),
            classKey.expireTimeInMinute,
            async () => {
                return await ClassRepo.findClassById({ id });
            },
        );
        return { class: _class };
    };

    static findOpenCourseInSemester = async ({ semesterId }) => {
        // let student = await findStudentWithUid({ uid });
        let courses = await tryGetFromCache(
            coursesInSemesterKey.key(semesterId),
            coursesInSemesterKey.expireTimeInMinute,
            async () => {
                return await ClassRepo.getOpenCourseIds({ semesterId });
            },
        );
        return { courses };
    };

    static update = async ({
        id,
        courseId,
        roomId,
        teacherId,
        maxCapacity,
        schedule,
        teamCode,
        courseName,
        teacherName,
        currentEnroll,
    }) => {
        // check exist
        const hoodedClass = await ClassRepo.findClassById({ id });
        if (!hoodedClass) {
            throw new BadRequestError('Class not existed');
        }
        courseId = courseId || hoodedClass.courseId;
        roomId = roomId || hoodedClass.roomId;
        teacherId = teacherId || hoodedClass.teacherId;
        maxCapacity = maxCapacity || hoodedClass.maxCapacity;
        schedule = schedule || hoodedClass.schedule;
        const semesterId = hoodedClass.semesterId;
        // validate
        const { error, value } = ClassValidate.classSchema.validate({
            id,
            semesterId,
            courseId,
            roomId,
            teacherId,
            maxCapacity,
            schedule,
            teamCode,
            courseName,
            teacherName,
            currentEnroll,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // check schedule (start <= end)
        schedule.forEach((element) => {
            const { error, value } =
                ScheduleValidate.scheduleSchema.validate(element);
            if (error) {
                throw new BadRequestError(error.details[0].message);
            }
            if (element.startShift > element.endShift) {
                throw new BadRequestError('Schedule invalid');
            }
        });
        let infor;
        // check isTeacherActive
        infor = JSON.stringify({ uid: teacherId });
        if (
            !(await gRPCTeacherClient.isTeacherActive({ infor })).metadata
                .active
        ) {
            throw new BadRequestError('Teacher not available');
        }
        // check isCourseActive
        infor = JSON.stringify({ id: courseId });
        if (
            !(await gRPCCourseClient.isCourseActive({ infor })).metadata.active
        ) {
            throw new BadRequestError('Course not available');
        }
        // check isSemesterOkayToAddClass
        infor = JSON.stringify({ id: semesterId });
        if (
            !(await gRPCSemesterClient.isSemesterOkayToAddClass({ infor }))
                .metadata.okay
        ) {
            throw new BadRequestError('Course not available');
        }
        // check isRoomExist
        const room = await RoomRepo.findRoomById({ id: roomId });
        if (!room) {
            throw new BadRequestError('Room not existed');
        }
        // check isRoomOverlap
        await CheckService.checkRoomOverlap({ roomId, schedule, classId: id });
        // check isTeacherOverlap
        await CheckService.checkTeacherOverlap({
            teacherId,
            schedule,
            classId: id,
        });

        let _class = await ClassRepo.updateClassInfor({
            id,
            courseId,
            roomId,
            teacherId,
            maxCapacity,
            schedule,
            teamCode,
            courseName,
            teacherName,
            currentEnroll,
        });

        return { class: _class };
    };
}

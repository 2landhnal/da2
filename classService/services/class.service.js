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
import { sendToQueue } from '../config/messageQueue/connect.js';
import { ClassStatus } from '../utils/classStatus.js';

export class ClassService {
    static create = async ({
        courseId,
        roomId,
        teacherId,
        semesterId,
        maxCapacity,
        schedule,
        teamCode,
        currentEnroll,
        status,
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
            status,
        });
        return { class: _class };
    };

    static syncInfor = async () => {
        const classes = await ClassRepo.queryClass({ query: {} });
        classes.forEach(async (_class) => {
            const { teacherId, id: classId } = _class;
            let infor;
            // check isTeacherActive
            infor = JSON.stringify({ uid: teacherId });
            if (
                !(await gRPCTeacherClient.isTeacherActive({ infor })).metadata
                    .active
            ) {
                throw new BadRequestError('Teacher not available');
            }
            const teacher = (await gRPCTeacherClient.getTeacher({ infor }))
                .metadata.teacher;
            infor = JSON.stringify({ id: _class.courseId });
            const course = (await gRPCCourseClient.getCourse({ infor }))
                .metadata.course;

            await ClassRepo.updateClassInfor({
                id: classId,
                teacherName: teacher.fullname,
                teacherId,
                courseId: course.id,
            });
        });
        return {};
    };

    static search = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);
        console.log(query);

        // query
        let classes;
        classes = await tryGetFromCache(
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
            classes,
            pagination: {
                page,
                resultPerPage,
                totalResults: classes.length,
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

    static finish = async ({ semesterId }) => {
        const classes = await ClassRepo.getClassesInSemester({ semesterId });
        const open = classes.filter(
            (e) => e.currentEnroll >= e.maxCapacity / 5,
        );
        const close = classes.filter(
            (e) => e.currentEnroll < e.maxCapacity / 5,
        );
        open.forEach((e) => {
            sendToQueue(
                'enrollment_finishEnrollment',
                JSON.stringify({ classId: e.id, status: ClassStatus.ACTIVE }),
            );
            sendToQueue(
                'class_finishEnrollment',
                JSON.stringify({ id: e.id, status: ClassStatus.ACTIVE }),
            );
        });
        close.forEach((e) => {
            sendToQueue(
                'enrollment_finishEnrollment',
                JSON.stringify({ classId: e.id, status: ClassStatus.CLOSED }),
            );
            sendToQueue(
                'class_finishEnrollment',
                JSON.stringify({ id: e.id, status: ClassStatus.CLOSED }),
            );
        });
        return { open, close };
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
        status,
    }) => {
        // check exist
        const hoodedClass = await ClassRepo.findClassById({ id });
        if (!hoodedClass) {
            throw new BadRequestError('Class not existed');
        }
        status = status || hoodedClass.status;
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
        const res = await gRPCTeacherClient.isTeacherActive({ infor });
        console.log(res);
        if (!res.metadata.active) {
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
            status,
        });

        return { class: _class };
    };
}

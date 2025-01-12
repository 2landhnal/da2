'use strict';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import { EnrollmentRepo } from '../models/repositories/enrollment.repo.js';
import { getInfoData } from '../utils/index.js';
import { RoleCode } from '../utils/roleCode.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import {
    enrollmentKey,
    enrollmentsKey,
    studentsInClass,
} from '../config/redis/redis.config.js';
import EnrollmentValidate from '../validate/enrollment.validate.js';
import { CheckService } from './check.service.js';
import { gRPCClassClient } from '../config/gRPC/class.proto.client.js';
import { gRPCStudentClient } from '../config/gRPC/student.grpc.client.js';
import { AccountStatus } from '../utils/accountStatus.js';
import { gRPCSemesterClient } from '../config/gRPC/semester.grpc.client.js';
import { sendToQueue } from '../config/messageQueue/connect.js';
import { gRPCCourseClient } from '../config/gRPC/course.grpc.client.js';
import { gRPCTeacherClient } from '../config/gRPC/teacher.grpc.client.js';

export const STUDENT_MAX_CREDIT = 24;

export class EnrollmentService {
    static create = async ({ studentId, classId, header_role, header_uid }) => {
        // auth
        const auth =
            header_role === RoleCode.BDT ||
            (header_role === RoleCode.STUDENT && header_uid === studentId);
        if (!auth) {
            throw new AuthFailureError();
        }
        // validate
        const { error, value } =
            EnrollmentValidate.enrollmentCreditSchema.validate({
                studentId,
                classId,
            });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // check existed
        const hoddedEnrollment = await EnrollmentRepo.findEnrollment({
            classId,
            studentId,
        });
        if (hoddedEnrollment) {
            throw new BadRequestError('Student already registered this class!');
        }

        // getClass => Class
        const { _class } = (
            await gRPCClassClient.getClass({
                infor: JSON.stringify({ classId }),
            })
        ).metadata;
        if (!_class) {
            throw new BadRequestError('Class not exist');
        }
        const { semesterId, courseId, teacherId } = _class;
        // getCourse
        const { course } = (
            await gRPCCourseClient.getCourse({
                infor: JSON.stringify({ id: courseId }),
            })
        ).metadata;
        const { credit: courseCredit, name: courseName } = course;
        // getStudent => Student
        const { student } = (
            await gRPCStudentClient.getStudent({
                infor: JSON.stringify({ studentId }),
            })
        ).metadata;
        if (!student) {
            throw new BadRequestError('Student not exist');
        }
        const { yoa, fullname: studentName, avatar: studentAvatar } = student;
        // getTeacher => Teacher
        const { teacher } = (
            await gRPCTeacherClient.getTeacher({
                infor: JSON.stringify({ uid: teacherId }),
            })
        ).metadata;
        const { fullname: teacherName } = teacher;
        // check isStudentStatusOkay => from above
        if (student.accountStatus === AccountStatus.CLOSED) {
            throw new BadRequestError('Student inactive');
        }
        // check isStudentAllow({studentid, semesterId}) => Semester
        const { allowed } = (
            await gRPCSemesterClient.isStudentAllowed({
                infor: JSON.stringify({ yoa, semesterId }),
            })
        ).metadata;
        if (!allowed) {
            throw new BadRequestError('Not in enroll time');
        }
        // check isClassOkayToEnroll => from above
        const currentEnroll = await EnrollmentRepo.getNumberOfStudentInClass({
            classId,
        });
        if (currentEnroll >= _class.maxCapacity) {
            throw new BadRequestError('Class full');
        }
        // check student credit => self
        const studentCredit = await EnrollmentRepo.getStudentEnrollmentCredit({
            studentId,
            semesterId,
        });
        if (studentCredit + course.credit > STUDENT_MAX_CREDIT) {
            throw new BadRequestError(
                `Student's max credit is ${STUDENT_MAX_CREDIT}, required ${
                    studentCredit + course.credit
                }`,
            );
        }
        // check isStudentOverlap => self
        const { schedule } = _class;
        await CheckService.checkStudentScheduleOverlap({
            studentId,
            semesterId,
            schedule,
        });

        const enrollment = await EnrollmentRepo.createEnrollment({
            studentId,
            classId,
            semesterId,
            schedule,
            courseId,
            courseCredit,
            courseName,
            studentName,
            studentAvatar,
            teacherId,
            teacherName,
        });
        // sync class enrollment
        sendToQueue('class_syncEnroll', JSON.stringify({ classId }));
        return { enrollment };
    };

    static syncInfor = async () => {
        const enrolls = await EnrollmentRepo.queryEnrollment({ query: {} });
        enrolls.forEach(async (enroll) => {
            const { classId, studentId } = enroll;
            // getClass => Class
            const { _class } = (
                await gRPCClassClient.getClass({
                    infor: JSON.stringify({ classId }),
                })
            ).metadata;
            if (!_class) {
                throw new BadRequestError('Class not exist');
            }
            const { semesterId, courseId, teacherId, teacherName } = _class;

            await EnrollmentRepo.updateEnrollment({
                studentId,
                classId,
                courseId,
                teacherId,
                teacherName,
            });
        });
        return {};
    };

    static search = async ({ page, resultPerPage, query, header_role }) => {
        if (header_role !== RoleCode.BDT) {
            throw new AuthFailureError('BDT required');
        }
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);
        console.log(query);

        // query
        let enrollments;
        enrollments = await tryGetFromCache(
            enrollmentsKey.key(page, resultPerPage, query),
            enrollmentsKey.expireTimeInMinute,
            async () => {
                return await EnrollmentRepo.queryEnrollment({
                    page,
                    resultPerPage,
                    query,
                });
            },
        );

        return {
            enrollments,
            pagination: {
                page,
                resultPerPage,
                totalResults: enrollments.length,
            },
        };
    };

    static getRegisteredClasses = async ({
        studentId,
        semesterId,
        header_role,
        header_uid,
    }) => {
        // auth
        const auth =
            header_role === RoleCode.BDT ||
            (header_role === RoleCode.STUDENT && header_uid === studentId);
        if (!auth) {
            throw new AuthFailureError();
        }

        // get from db
        const classes = await EnrollmentRepo.getRegisteredClass({
            studentId,
            semesterId,
        });
        return { classes };
    };

    static getNumberOfStudentInClass = async ({ classId, header_role }) => {
        // auth
        const auth = header_role === RoleCode.BDT;
        if (!auth) {
            throw new AuthFailureError();
        }

        // get from db
        const count = await EnrollmentRepo.getNumberOfStudentInClass({
            classId,
        });
        return { count };
    };

    static getStudentInClass = async ({ classId, header_role, header_uid }) => {
        // check is students in class
        const students = await tryGetFromCache(
            studentsInClass.key(classId),
            studentsInClass.expireTimeInMinute,
            async () => {
                return await EnrollmentRepo.getStudentInClass({ classId });
            },
        );
        const isStudentInClass =
            RoleCode.STUDENT &&
            students.some((student) => student.studentId === header_uid);
        // auth
        const auth =
            header_role === RoleCode.BDT ||
            header_role === RoleCode.TEACHER ||
            isStudentInClass;
        if (!auth) {
            throw new AuthFailureError();
        }
        return { students };
    };

    static getStudentCurrentUsedCredit = async ({
        studentId,
        semesterId,
        header_uid,
        header_role,
    }) => {
        // auth
        const auth =
            header_role === RoleCode.BDT ||
            (header_role === RoleCode.STUDENT && header_uid === studentId);
        if (!auth) {
            throw new AuthFailureError();
        }
        const credit = await EnrollmentRepo.getStudentEnrollmentCredit({
            studentId,
            semesterId,
        });
        return { credit };
    };

    static delete = async ({
        studentId,
        classIds,
        header_uid,
        header_role,
    }) => {
        // auth
        const auth =
            header_role === RoleCode.BDT ||
            (header_role === RoleCode.STUDENT && header_uid === studentId);
        if (!auth) {
            throw new AuthFailureError();
        }

        if (!Array.isArray(classIds) || classIds.length === 0) {
            throw new BadRequestError('ClassIds must be a non-empty array');
        }

        const { error, value } =
            await EnrollmentValidate.listClassSchema.validate({
                classIds,
            });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        if (header_role === RoleCode.STUDENT) {
            // getClass => Class
            const { _class } = (
                await gRPCClassClient.getClass({
                    infor: JSON.stringify({ classId: classIds[0] }),
                })
            ).metadata;
            const { semesterId } = _class;
            // getStudent => Student
            const { student } = (
                await gRPCStudentClient.getStudent({
                    infor: JSON.stringify({ studentId }),
                })
            ).metadata;
            const { yoa } = student;
            // check isStudentStatusOkay => from above
            if (student.accountStatus === AccountStatus.CLOSED) {
                throw new BadRequestError('Student inactive');
            }
            // check isStudentAllow({studentid, semesterId}) => Semester
            const { allowed } = (
                await gRPCSemesterClient.isStudentAllowed({
                    infor: JSON.stringify({ yoa, semesterId }),
                })
            ).metadata;
            if (!allowed) {
                throw new BadRequestError('Not in enroll time');
            }
        }

        const enrollments = await EnrollmentRepo.deleteEnrollment({
            studentId,
            classIds,
        });
        // sync class enrollment
        classIds.forEach((classId) => {
            sendToQueue('class_syncEnroll', JSON.stringify({ classId }));
        });
        return { enrollments };
    };
}

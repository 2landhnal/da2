'use strict';
import CourseValidate from '../validate/course.validate.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import {
    createCourse,
    updateCourseInfor,
    findCourseWithId,
    queryCourse,
    closeCourseById,
    searchByKeyword,
} from '../models/repositories/course.repo.js';
import { getInfoData } from '../utils/index.js';
import { RoleCode } from '../utils/roleCode.js';
import { tryGetFromCache } from '../helpers/redis.helper.js';
import {
    courseKey,
    coursesKey,
    coursesKeyByKeyword,
} from '../config/redis/redis.config.js';

export class CourseService {
    static create = async ({ id, credit, ...infor }) => {
        // validate
        const { error, value } = CourseValidate.courseCreditSchema.validate({
            credit,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        const hoddedCourse = await findCourseWithId({ id });
        if (hoddedCourse) {
            throw new BadRequestError('Course id existed');
        }

        const course = await createCourse({ id, credit, ...infor });
        return { course };
    };

    static query = async ({ page, resultPerPage, query }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;
        query = JSON.parse(query);

        // query
        let courses;
        courses = await tryGetFromCache(
            coursesKey.key(page, resultPerPage, query),
            coursesKey.expireTimeInMinute,
            async () => {
                return await queryCourse({ page, resultPerPage, query });
            },
        );

        return {
            courses,
            pagination: {
                page,
                resultPerPage,
                totalResults: courses.length,
            },
        };
    };

    static search = async ({ page, resultPerPage, keyword }) => {
        // validate
        page = Number(page) || 1;
        resultPerPage = Number(resultPerPage) || 10;

        // query
        const courses = await tryGetFromCache(
            coursesKeyByKeyword.key(page, resultPerPage, keyword),
            coursesKeyByKeyword.expireTimeInMinute,
            async () => {
                return await searchByKeyword({ page, resultPerPage, keyword });
            },
        );

        return {
            courses,
            pagination: {
                page,
                resultPerPage,
                totalResults: courses.length,
            },
        };
    };

    static findById = async ({ id }) => {
        // let student = await findStudentWithUid({ uid });
        let course = await tryGetFromCache(
            courseKey.key(id),
            courseKey.expireTimeInMinute,
            async () => {
                return await findCourseWithId({ id });
            },
        );
        return { course };
    };

    static closeById = async ({ id }) => {
        // close
        const course = await closeCourseById({ id });

        return { course };
    };

    static update = async ({ id, ...updates }) => {
        // check existed
        let course = await findCourseWithId({ id });
        if (!course) {
            throw new BadRequestError('Course not found');
        }

        // validate
        const { error, value } = CourseValidate.courseCreditSchema.validate({
            credit: updates.credit || course.credit,
        });
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        course = await updateCourseInfor({ id, ...updates });

        return { course };
    };
}

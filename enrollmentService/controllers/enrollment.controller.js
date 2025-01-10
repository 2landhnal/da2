'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { EnrollmentService } from '../services/enrollment.service.js';
class EnrollmentController {
    create = async (req, res, next) => {
        new CREATED({
            message: 'Create enrollment successfully!',
            metadata: await EnrollmentService.create({
                header_role: req.header_role,
                header_uid: req.header_uid,
                ...req.body,
            }),
        }).send(res);
    };

    search = async (req, res, next) => {
        const metadata = await EnrollmentService.search({
            header_role: req.header_role,
            header_uid: req.header_uid,
            ...req.query,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    getStudentInClass = async (req, res, next) => {
        const metadata = await EnrollmentService.getStudentInClass({
            header_role: req.header_role,
            header_uid: req.header_uid,
            ...req.params,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    getRegisteredClasses = async (req, res, next) => {
        const metadata = await EnrollmentService.getRegisteredClasses({
            header_role: req.header_role,
            header_uid: req.header_uid,
            ...req.query,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    getNumberOfStudentInClass = async (req, res, next) => {
        const metadata = await EnrollmentService.getNumberOfStudentInClass({
            header_role: req.header_role,
            header_uid: req.header_uid,
            ...req.params,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    getStudentCurrentUsedCredit = async (req, res, next) => {
        const metadata = await EnrollmentService.getStudentCurrentUsedCredit({
            header_role: req.header_role,
            header_uid: req.header_uid,
            ...req.query,
        });
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete enrollment successfully!',
            metadata: await EnrollmentService.delete({
                header_role: req.header_role,
                header_uid: req.header_uid,
                ...req.body,
            }),
        }).send(res);
    };
}

export const enrollmentController = new EnrollmentController();

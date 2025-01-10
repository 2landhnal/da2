'use strict';
import Joi from 'joi';

class EnrollmentValidate {
    static enrollmentCreditSchema = Joi.object({
        studentId: Joi.string().required(),
        classId: Joi.string().required(),
    });

    static listClassSchema = Joi.object({
        classIds: Joi.array().items(Joi.string()).required(),
    });
}

export default EnrollmentValidate;

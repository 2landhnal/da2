'use strict';
import Joi from 'joi';

class SemesterValidate {
    static semesterSchema = Joi.object({
        id: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    }).unknown(true);
}

export default SemesterValidate;

'use strict';
import Joi from 'joi';

class ClassValidate {
    static classSchema = Joi.object({
        id: Joi.string().required(),
        courseId: Joi.string().required(),
        roomId: Joi.string().required(),
        teacherId: Joi.string().required(),
        semesterId: Joi.string().required(),
        maxCapacity: Joi.number().required(),
    }).unknown(true);
}

export default ClassValidate;

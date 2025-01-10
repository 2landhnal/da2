'use strict';
import Joi from 'joi';

class CourseValidate {
    static courseCreditSchema = Joi.object({
        credit: Joi.number().required().less(10).greater(0),
    });
}

export default CourseValidate;

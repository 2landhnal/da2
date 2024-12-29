'use strict';
import Joi from 'joi';

class StudentValidate {
    static studentRegisterSchema = Joi.object({
        personalEmail: Joi.string().email().required(),
        fullname: Joi.string().required(),
    });
}

export default StudentValidate;

'use strict';
import Joi from 'joi';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
class StudentValidate {
    static studentRegisterSchema = Joi.object({
        personalEmail: Joi.string().email().required(),
        fullname: Joi.string().required(),
    });

    static fileSchema = Joi.object({
        file: Joi.object({
            mimetype: Joi.string()
                .valid('image/jpeg', 'image/png', 'image/webp')
                .required(),
            size: Joi.number().max(MAX_FILE_SIZE).required(),
        })
            .required()
            .unknown(true),
    });
}

export default StudentValidate;

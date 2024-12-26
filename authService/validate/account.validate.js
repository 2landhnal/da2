'use strict';
import Joi from 'joi';

class AccountValidate {
    static accountRegisterSchema = Joi.object({
        email: Joi.string().email().required(),
        uid: Joi.string().required(), // Thêm trường email vào schema
        password: Joi.string()
            .pattern(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            )
            .required()
            .messages({
                'string.pattern.base':
                    'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
            }),
        role: Joi.string().required(),
    });

    static accountLoginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
}

export default AccountValidate;

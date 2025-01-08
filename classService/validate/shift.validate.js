'use strict';
import Joi from 'joi';

class ShiftValidate {
    static shiftSchema = Joi.object({
        id: Joi.number().required(),
        startAt: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:mm format')
            .required(),
        endAt: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:mm format')
            .required(),
    });
}

export default ShiftValidate;

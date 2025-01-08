'use strict';
import Joi from 'joi';

class ScheduleValidate {
    static scheduleSchema = Joi.object({
        id: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    }).unknown(true);
    static timeSlotSchema = Joi.object({
        startAt: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:mm format')
            .required(),
        endAt: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/, 'HH:mm format')
            .required(),
        allowance: Joi.array().items(Joi.string()),
    }).unknown(true);
}

export default ScheduleValidate;

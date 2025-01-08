'use strict';
import Joi from 'joi';

class ScheduleValidate {
    static scheduleSchema = Joi.object({
        id: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    }).unknown(true);
    static timeSlotSchema = Joi.object({
        startAt: Joi.string().required(),
        endAt: Joi.string().required(),
        allowance: Joi.array().items(Joi.string()),
    }).unknown(true);
}

export default ScheduleValidate;

'use strict';
import Joi from 'joi';

class ScheduleValidate {
    static scheduleSchema = Joi.object({
        startShift: Joi.number().less(13).greater(0).required(),
        endShift: Joi.number().less(13).greater(0).required(),
        dayOfWeek: Joi.number().less(9).greater(1).required(),
    }).unknown(true);
}

export default ScheduleValidate;

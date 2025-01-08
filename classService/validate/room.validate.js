'use strict';
import Joi from 'joi';

class RoomValidate {
    static roomSchema = Joi.object({
        id: Joi.string().required(),
        maxCapacity: Joi.number().required().greater(0),
    });
}

export default RoomValidate;

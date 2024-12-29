'use strict';

import {
    AuthFailureError,
    NotFoundError,
} from '../responses/error.response.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { RoleCode } from '../utils/roleCode.js';
import jwt from 'jsonwebtoken';

export const HEADER = {
    AUTHORIZATION: 'authorization',
    UID: 'x-user-id',
    ROLE: 'x-user-role',
};

export const bdtRequired = asyncHandler(async (req, res, next) => {
    const role = req.headers[HEADER.ROLE];
    if (role != RoleCode.BDT) {
        throw new AuthFailureError();
    }
    return next();
});

export const authentication = asyncHandler(async (req, res, next) => {
    // --------------------------------------------------
    // accessToken
    // --------------------------------------------------
    try {
        // --------------------------------------------------
        // Validate access token và giải mã
        // --------------------------------------------------
        const accessToken = req.headers[HEADER.AUTHORIZATION].split(' ')[1];
        if (!accessToken || accessToken == '')
            throw new AuthFailureError('Error: Invalid Request');
        const isValid = await jwt.verify(accessToken, process.env.accessKey);
        if (!isValid) {
            throw new AuthFailureError('Error: Access token invalid');
        }
        const payload = await jwt.decode(accessToken);

        // --------------------------------------------------
        // Gán vào request
        // --------------------------------------------------
        req.tokenData = payload;
        return next();
    } catch (err) {
        throw err;
    }
});

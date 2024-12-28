'use strict';

import {
    AuthFailureError,
    NotFoundError,
} from '../responses/error.response.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import { RoleCode } from '../utils/roleCode.js';
import jwt from 'jsonwebtoken';

const HEADER = {
    AUTHORIZATION: 'authorization',
};

export const bdtRequired = asyncHandler(async (req, res, next) => {
    const payload = await jwt.decode(
        req.headers[HEADER.AUTHORIZATION].split(' ')[1],
    );
    const { role } = payload;
    if (role != RoleCode.BDT) {
        throw new AuthFailureError(error.details[0].message);
    }
    return next();
});

const authentication = asyncHandler(async (req, res, next) => {
    const user_id = req.headers[HEADER.CLIENT_ID];
    // --------------------------------------------------
    // Validate user_id
    // --------------------------------------------------
    const userInput = {
        id: user_id,
    };

    const { error, value } =
        UserValidate.userAuthenticationSchema.validate(userInput);

    if (error) {
        throw new BadRequestError(error.details[0].message);
    }

    // --------------------------------------------------
    // Lấy public key, private key, refresh token
    // --------------------------------------------------
    const keyStore = await findKeyByUserId({ user_id });
    if (!keyStore) throw new NotFoundError('Error: Not found keyStore');

    if (req.headers[HEADER.REFRESHTOKEN]) {
        // --------------------------------------------------
        // Trường hợp refresh token
        // --------------------------------------------------
        try {
            // --------------------------------------------------
            // Validate refresh token và giải mã
            // --------------------------------------------------
            const refreshToken = req.headers[HEADER.REFRESHTOKEN];
            if (!refreshToken || refreshToken == '')
                throw new AuthFailureError('Error: Invalid Request');
            const decodeUser = await verifyjwt(
                refreshToken,
                keyStore.private_key,
            );

            // --------------------------------------------------
            // Kiểm tra refresh token khớp với user_id
            // --------------------------------------------------
            if (user_id != decodeUser.id)
                throw new AuthFailureError('Error: Invalid userId');

            // --------------------------------------------------
            // Gán vào request
            // --------------------------------------------------
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (err) {
            throw err;
        }
    }

    // --------------------------------------------------
    // Trường hợp authentication
    // --------------------------------------------------
    try {
        // --------------------------------------------------
        // Validate access token và giải mã
        // --------------------------------------------------
        const accessToken = req.headers[HEADER.AUTHORIZATION];
        if (!accessToken || accessToken == '')
            throw new AuthFailureError('Error: Invalid Request');
        const decodeUser = await verifyjwt(accessToken, keyStore.public_key);
        // --------------------------------------------------
        // Kiểm tra refresh token khớp với user_id
        // --------------------------------------------------
        if (user_id != decodeUser.id)
            throw new AuthFailureError('Error: Invalid userId');

        // --------------------------------------------------
        // Gán vào request
        // --------------------------------------------------
        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = keyStore.refresh_token;
        return next();
    } catch (err) {
        throw err;
    }
});

export { authentication };

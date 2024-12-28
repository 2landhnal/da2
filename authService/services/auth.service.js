'use strict';
import AccountValidate from '../validate/account.validate.js';
import bcrypt from 'bcryptjs';
import {
    createAccessToken,
    createTokenPair,
    verifyAccessToken,
    verifyRefreshToken,
} from '../helpers/hash.helper.js';
import {
    pushToList,
    valueExistsInList,
    valueExistInHashedList,
    removeRefreshToken,
    saveRefreshToken,
    isRefreshTokenValid,
} from '../models/repositories/redis.repo.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import {
    createAccount,
    findAccountrWithEmail,
    findAccountrWithUid,
    queryAccount,
} from '../models/repositories/account.repo.js';
import { getInfoData } from '../utils/index.js';
import { genSalt } from '../helpers/hash.helper.js';
import jwt from 'jsonwebtoken';

export class AuthService {
    static register = async ({
        email,
        password,
        uid,
        role,
        personal_email,
    }) => {
        const userInput = {
            email,
            password,
            uid,
            role,
            personal_email,
        };

        // validate userInput
        const { error, value } = AccountValidate.accountRegisterSchema.validate(
            { email, password, uid, role },
        );
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // Check username existed
        let hoddedUser = await findAccountrWithEmail({ email });
        if (hoddedUser) {
            throw new BadRequestError('Error: User already registered');
        }

        // Check uid existed
        hoddedUser = await findAccountrWithUid({ uid });
        if (hoddedUser) {
            throw new BadRequestError('Error: User already registered');
        }

        const salt = await genSalt();
        const newAccount = await createAccount({ ...userInput, salt });
        return {
            account: getInfoData({
                fileds: ['uid', 'email', 'role'],
                object: newAccount,
            }),
        };
    };

    static login = async ({ email, password }) => {
        const userInput = { email, password };

        // validate
        const { error, value } =
            AccountValidate.accountLoginSchema.validate(userInput);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // check password
        const account = await findAccountrWithEmail({ email });
        const salt = account.salt;
        const hashedPassword = await bcrypt.hash(password, salt);
        const valid = hashedPassword === account.password;
        if (!valid) {
            throw new AuthFailureError();
        }

        // generate token
        const payload = {
            uid: account.uid,
            role: account.role,
            fullname: account.fullname || '',
            email: account.email,
        };
        const { refreshToken, accessToken } = await createTokenPair(payload);
        // store token in cache
        await saveRefreshToken(email, refreshToken);
        // send token
        return {
            accessToken,
            refreshToken,
        };
    };

    static logout = async ({ refreshToken }) => {
        const payload = await jwt.decode(refreshToken);
        const { email } = payload;
        const isValid = await isRefreshTokenValid(refreshToken);
        if (!isValid) {
            throw new AuthFailureError();
        }

        const removed = await removeRefreshToken(email, refreshToken);
        if (!removed) {
            throw new BadRequestError();
        }
        // remove from cookie
        return {};
    };

    static search = async ({ page, resultPerPage, query }) => {
        const result = await queryAccount({ page, resultPerPage, query });
        // remove from cookie
        return result;
    };

    static refreshAccessToken = async ({ token }) => {
        const payload = await jwt.decode(token);
        const { email } = payload;

        // token stored in db
        const existInList = await isRefreshTokenValid(token);
        if (!existInList) {
            throw new AuthFailureError();
        }

        // token expired
        const isValid = await verifyRefreshToken(token);
        if (!isValid) {
            await removeRefreshToken(email, token);
            throw new AuthFailureError();
        }

        const { accessToken } = await createAccessToken(payload);
        return { accessToken };
    };

    static checkRefreshToken = async ({ token }) => {
        const payload = await jwt.decode(token);
        const { email } = payload;

        // token stored in db
        const existInList = await isRefreshTokenValid(token);
        if (!existInList) {
            throw new AuthFailureError();
        }

        // token expired
        const isValid = await verifyRefreshToken(token);
        if (!isValid) {
            await removeRefreshToken(email, token);
            throw new AuthFailureError();
        }
        return {};
    };
}

'use strict';
import AccountValidate from '../validate/account.validate.js';
import bcrypt from 'bcryptjs';
import { createTokenPair } from '../helpers/hash.js';
import {
    pushToList,
    valueExistsInList,
} from '../models/repositories/redis.repo.js';
import {
    BadRequestError,
    AuthFailureError,
} from '../responses/error.response.js';
import {
    createAccount,
    findAccountrWithEmail,
    findAccountrWithUid,
} from '../models/repositories/account.repo.js';
import { getInfoData } from '../utils/index.js';
import { genSalt } from '../helpers/hash.js';

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
            metadata: {
                account: getInfoData({
                    fileds: ['uid', 'email', 'role'],
                    object: newAccount,
                }),
            },
        };
    };

    static login = async ({ email, password }) => {
        const userInput = { email, password };

        // validate
        const { error, value } = AccountValidate.accountLoginSchema.validate({
            email,
            password,
        });
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
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await pushToList(`refreshTokenList:${email}`, hashedRefreshToken);
        // send token
        return {
            metadata: {
                accessToken,
                refreshToken,
            },
        };
    };

    static refreshTokenOkay = async ({ token }) => {
        return {
            metadata: {
                token,
            },
        };
    };
}

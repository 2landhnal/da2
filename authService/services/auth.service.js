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
    findAccountWithEmail,
    findAccountWithUid,
    queryAccount,
    updateInfor,
} from '../models/repositories/account.repo.js';
import { getInfoData, removeNullField } from '../utils/index.js';
import { genSalt } from '../helpers/hash.helper.js';
import jwt from 'jsonwebtoken';
import { AccountStatus } from '../utils/accountStatus.js';
import { sendToQueue } from '../config/messageQueue/connect.js';
import { RoleCode } from '../utils/roleCode.js';

export class AuthService {
    static register = async ({ email, password, uid, role, personalEmail }) => {
        const userInput = {
            email,
            password,
            uid,
            role,
            personalEmail,
        };

        // validate userInput
        const { error, value } = AccountValidate.accountRegisterSchema.validate(
            {
                email,
                password,
                uid,
                role,
            },
        );
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // Check username existed
        let hoddedUser = await findAccountWithEmail({ email });
        if (hoddedUser) {
            console.log(hoddedUser);
            throw new BadRequestError('Error: User already registered');
        }

        // Check uid existed
        hoddedUser = await findAccountWithUid({ uid });
        if (hoddedUser && hoddedUser.role === role) {
            throw new BadRequestError(
                `Error: ${role} with uid ${uid} already registered`,
            );
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
            throw new AuthFailureError("Email or password isn't correct");
        }

        // check password
        const account = await findAccountWithEmail({ email });
        const salt = account.salt;
        const hashedPassword = await bcrypt.hash(password, salt);
        const valid = hashedPassword === account.password;
        if (!valid) {
            throw new AuthFailureError();
        }

        // check account closed
        const { accountStatus } = account;
        if (accountStatus === AccountStatus.CLOSED) {
            throw new AuthFailureError('Account closed');
        }

        // generate token
        const payload = {
            uid: account.uid,
            role: account.role,
            fullname: account.fullname || '',
            email: account.email,
            avatar: account.avatar,
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

    static changePassword = async ({ currentPassword, newPassword, uid }) => {
        const userInput = { uid, password: newPassword };

        // validate
        const { error, value } =
            AccountValidate.changePasswordSchema.validate(userInput);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }

        // get account
        const account = await findAccountWithUid({ uid });
        const salt = account.salt;

        // check password
        const hashedPassword = await bcrypt.hash(currentPassword, salt);
        if (hashedPassword !== account.password) {
            throw new AuthFailureError('Current password not match');
        }

        // check new password
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        if (hashedNewPassword === account.password) {
            throw new BadRequestError(
                'New password must be different from current password',
            );
        }

        // check account closed
        const { accountStatus } = account;
        if (accountStatus === AccountStatus.CLOSED) {
            throw new AuthFailureError('Account closed');
        }

        // store new password
        account.password = newPassword;
        await account.save();
        // send token
        return {};
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
        page = page || 1;
        resultPerPage = resultPerPage || 10;
        const accounts = await queryAccount({ page, resultPerPage, query });
        // remove from cookie
        return {
            accounts,
            pagination: {
                page,
                resultPerPage,
                totalResults: accounts.length,
            },
        };
    };

    static syncStatus = async () => {
        const page = 1;
        const resultPerPage = 1000;
        const accounts = await queryAccount({ page, resultPerPage, query: {} });
        accounts.forEach((account) => {
            if (account.role === RoleCode.STUDENT) {
                sendToQueue(
                    'student_syncStatus',
                    JSON.stringify({
                        uid: account.uid,
                        accountStatus: account.accountStatus,
                    }),
                );
            } else if (account.role === RoleCode.TEACHER) {
                sendToQueue(
                    'teacher_syncStatus',
                    JSON.stringify({
                        uid: account.uid,
                        accountStatus: account.accountStatus,
                    }),
                );
            }
        });
        return {};
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

    static syncInfor = async (infor) => {
        infor = getInfoData({
            fileds: ['uid', 'avatar', 'fullname', 'role'],
            object: infor,
        });
        infor = removeNullField(infor);
        await updateInfor({ ...infor });
        console.log('Sync infor successfull ', JSON.stringify(infor));
        return {};
    };
}

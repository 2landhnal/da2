'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { AuthService } from '../services/auth.service.js';
import { REFRESHTOKEN_COOKIE_TIME } from '../config/const.config.js';
class AuthController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'Registered successfully!',
            metadata: await AuthService.register(req.body),
        }).send(res);
    };

    login = async (req, res, next) => {
        const { accessToken, refreshToken } = await AuthService.login(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Bảo vệ cookie khỏi bị truy cập từ JavaScript
            secure: process.env.nodeEnv === 'production', // Chỉ sử dụng HTTPS trong môi trường production
            sameSite: 'strict', // Bảo vệ chống CSRF
            maxAge: REFRESHTOKEN_COOKIE_TIME, // Thời gian tồn tại của cookie
        });
        new SuccessResponse({
            message: 'Login successfully!',
            metadata: { accessToken },
        }).send(res);
    };

    logout = async (req, res, next) => {
        const metadata = await AuthService.logout(req.cookies);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.nodeEnv === 'production', // Chuyển thành true nếu dùng HTTPS
            sameSite: 'Strict',
        });
        new SuccessResponse({
            message: 'Logout successfully!',
            metadata,
        }).send(res);
    };

    search = async (req, res, next) => {
        const metadata = await AuthService.search(req.body);
        new SuccessResponse({
            message: 'Search successfully!',
            metadata,
        }).send(res);
    };

    refreshAccessToken = async (req, res, next) => {
        const { refreshToken } = req.cookies;
        new SuccessResponse({
            message: 'Refresh access token successfully!',
            metadata: await AuthService.refreshAccessToken({
                token: refreshToken,
            }),
        }).send(res);
    };
}

export const authController = new AuthController();

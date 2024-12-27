'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response.js';
import { AuthService } from '../services/auth.service.js';
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
            maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian tồn tại của cookie (7 ngày)
        });
        new SuccessResponse({
            message: 'Login successfully!',
            metadata: { accessToken },
        }).send(res);
    };

    logout = async (req, res, next) => {
        const metadata = await AuthService.logout(req.body);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false, // Chuyển thành true nếu dùng HTTPS
            sameSite: 'Strict',
        });
        new SuccessResponse({
            message: 'Logout successfully!',
            metadata,
        }).send(res);
    };

    checkRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Refresh token valid!',
            metadata: await AuthService.checkRefreshToken(req.params),
        }).send(res);
    };
}

export const authController = new AuthController();

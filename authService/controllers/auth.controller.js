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
        new SuccessResponse({
            message: 'Login successfully!',
            metadata: await AuthService.login(req.body),
        }).send(res);
    };
}

export const authController = new AuthController();

'use strict';
import { CREATED, SuccessResponse } from '../responses/success.response';
import { AuthService } from '../services/auth.service';
class AuthController {
    register = async (req, res, next) => {
        new CREATED({
            message: 'Registered successfully!',
            metadata: await AuthService.register(req.body),
        }).send(res);
    };
}

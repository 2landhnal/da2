import { HEADER } from './auth.middleware.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
export const extractInfor = asyncHandler(async (req, res, next) => {
    const header_role = req.headers[HEADER.ROLE];
    const header_uid = req.headers[HEADER.UID];
    req.header_role = header_role;
    req.header_uid = header_uid;
    return next();
});

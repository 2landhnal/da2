'use strict';
import bcrypt from 'bcryptjs';

const SALT_ROUND = 10;

export const genSalt = async () => {
    return await bcrypt.genSalt(SALT_ROUND);
};

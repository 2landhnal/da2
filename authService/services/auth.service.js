import AccountValidate from '../validate/account.validate.js';
import { BadRequestError } from '../responses/error.response.js';
import {
    createAccount,
    findUserWithEmail,
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
        const hoddedUser = await findUserWithEmail({ email });
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
}

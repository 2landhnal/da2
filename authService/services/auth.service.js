import AccountValidate from '../validate/account.validate';
import { BadRequestError } from '../responses/error.response';
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
        const { error, value } =
            AccountValidate.accountRegisterSchema.validate(userInput);
        if (error) {
            throw new BadRequestError(error.details[0].message);
        }
    };
}

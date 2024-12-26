import Account from '../account.js';
export const createAccount = async ({ email, password, uid, role, salt }) => {
    try {
        const newAccount = new Account({
            email,
            password,
            uid,
            role,
            salt,
        });
        console.log(salt);
        await newAccount.save();
        // MQ: send email
        return newAccount;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

export const findUserWithEmail = async ({ email }) => {
    try {
        const found = await Account.findOne({ email });
        return found;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

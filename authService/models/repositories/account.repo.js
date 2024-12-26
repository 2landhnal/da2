import Account from '../account.js';
const createAccount = async ({ email, password, uid, role, salt }) => {
    try {
        const newAccount = new Account({
            email,
            password,
            uid,
            role,
            salt,
        });
        await newAccount.save();
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

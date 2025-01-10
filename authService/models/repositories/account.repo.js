import Account from '../account.js';
import { AccountStatus } from '../../utils/accountStatus.js';
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

export const queryAccount = async ({ page, resultPerPage, query }) => {
    try {
        // Skip calculation for pagination
        const skip = (page - 1) * resultPerPage;

        // Parse the query string (e.g., "Accountname=abc") into a MongoDB query object
        let queryObject = {};
        for (const field in query) {
            if (query[field]) {
                queryObject[field] = { $regex: query[field], $options: 'i' }; // 'i' để tìm kiếm không phân biệt hoa thường
            }
        }

        // Execute query with pagination
        const foundAccounts = await Account.find(queryObject)
            .skip(skip)
            .limit(resultPerPage);

        // Return paginated results and metadata
        return foundAccounts;
    } catch (error) {
        console.error('Error querying accounts:', error);
        throw error;
    }
};

export const deleteAccountByEmail = async ({ email }) => {
    try {
        const found = await Account.findOne({ email });
        return found;
    } catch (error) {
        console.error('Error delete account:', error);
        throw error;
    }
};

export const findAccountWithEmail = async ({ email }) => {
    try {
        const found = await Account.findOne({ email });
        return found;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

export const findAccountWithUid = async ({ uid }) => {
    try {
        const found = await Account.findOne({ uid });
        return found;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

export const closeAccount = async ({ uid }) => {
    try {
        const account = await Account.findOne({ uid });
        account.accountStatus = AccountStatus.closeAccount;
        await account.save();
        return account;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

export const updateInfor = async ({ uid, role, ...update }) => {
    try {
        const account = await Account.findOneAndUpdate(
            { uid, role },
            { $set: update },
            { new: true }, // Return the updated document
        );
        return account;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

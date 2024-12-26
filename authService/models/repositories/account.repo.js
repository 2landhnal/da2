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
        // Ensure page and resultPerPage have default values if not provided
        const currentPage = page || 1;
        const resultsPerPage = resultPerPage || 10;

        // Skip calculation for pagination
        const skip = (currentPage - 1) * resultsPerPage;

        // Parse the query string (e.g., "Accountrname=abc") into a MongoDB query object
        const queryObject = query
            ? query.split('&').reduce((acc, pair) => {
                  const [key, value] = pair.split('=');
                  acc[key] = value;
                  return acc;
              }, {})
            : {};

        // Execute query with pagination
        const foundAccounts = await Account.find(queryObject)
            .skip(skip)
            .limit(resultsPerPage);

        // Get the total count for the query
        const totalAccounts = await Account.countDocuments(queryObject);

        // Return paginated results and metadata
        return {
            accounts: foundAccounts,
            pagination: {
                currentPage,
                resultsPerPage,
                totalResults: totalAccounts,
                totalPages: Math.ceil(totalAccounts / resultsPerPage),
            },
        };
    } catch (error) {
        console.error('Error querying accounts:', error);
        throw error;
    }
};

export const deleteAccountByUid = async ({ uid }) => {
    try {
        const found = await Account.findOne({ uid });
        return found;
    } catch (error) {
        console.error('Error delete account:', error);
        throw error;
    }
};

export const findAccountrWithEmail = async ({ email }) => {
    try {
        const found = await Account.findOne({ email });
        return found;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

export const findAccountrWithUid = async ({ uid }) => {
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

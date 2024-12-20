import Account from '../models/account.js';
import tokenController from './tokenController.js';
import jwt from 'jsonwebtoken';

class AccountController {
    // [POST] /login
    async login(req, res, next) {
        try {
            const acc = await Account.findOne({ email: req.body.email });

            if (!acc) {
                return res.status(404).send({ msg: 'Account not found' });
            }

            const isCorrect = await acc.comparePassword(req.body.password);
            if (!isCorrect) {
                return res
                    .status(401)
                    .send({ msg: 'Email or password invalid' });
            }

            const account = { accountId: acc._id, role: acc.role };
            const tokenPair = await tokenController.generatePairToken(account);
            res.status(200).json({ ...account, ...tokenPair });
        } catch (err) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    // [POST] /create
    async create(req, res, next) {
        try {
            const fields = {
                email: req.body.email,
                password: req.body.password,
            };
            // Check if the account already exists
            const existingAccount = await Account.findOne({
                email: fields.email,
            });
            if (existingAccount) {
                return res.status(400).send({
                    msg: `Account with email ${fields.email} already exists`,
                });
            }

            const acc = new Account({
                ...fields,
                role: req.body.role || 3,
            });
            await acc.save();
            console.log(`Create account ${req.body.email} successfully`);
            res.status(200).json(acc);
        } catch (err) {
            res.status(500).json({ err });
        }
    }

    // [GET] /find/:keyword
    async find(req, res, next) {
        try {
            const fieldsToSearch = ['_id', 'fullName']; // Define fields to search
            const regex = new RegExp(req.params.keyword, 'i'); // Case-insensitive regex

            const query = {
                $or: fieldsToSearch.map((field) => ({
                    [field]: { $regex: regex },
                })),
            };

            const results = await Account.find(query);
            console.log('Matching documents:', results);
            res.status(200).json(results);
        } catch (err) {
            console.error('Error finding documents:', err);
            res.status(500).json({ error });
        }
    }

    // [PUT] /update
    async update(req, res, next) {
        try {
            const { accountId } = req.tokenData;
            const acc = await Account.findOne({ _id: accountId });
            acc.password = req.body.newPassword;
            await acc.save();
            res.status(200).json({
                msg: `Update account ${accountId} successfully`,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error });
        }
    }

    // [GET] /getAccount
    async getAccount(req, res, next) {
        try {
            const { accountId } = req.tokenData;
            const account = await Account.findOne({ _id: accountId });
            res.status(200).json(account);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /delete/:email
    async delete(req, res, next) {
        try {
            const email = req.params.email;
            if (email == null) {
                res.send({ msg: `Email as param required` });
            }
            await Account.deleteOne({ email });
            res.status(200).json({ msg: `Delete account successfully` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /logout
    async logout(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const refreshToken = authHeader && authHeader.split(' ')[1];
            await tokenController.removeRefreshToken(refreshToken);
            res.status(200).json({ msg: `Logout account successfully` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error });
        }
    }
}

export default new AccountController();

const Account = require('../models/account');
const tokenController = require('./tokenController');
const jwt = require('jsonwebtoken');

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
                    .send({ msg: 'email or password invalid' });
            }

            const account = { accountId: acc._id, role: acc.role };
            const tokenPair = await tokenController.generatePairToken(account);
            res.json({ ...account, ...tokenPair });
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
            res.send(acc);
        } catch (err) {
            res.send(err);
        }
    }

    // [PUT] /update
    async update(req, res, next) {
        try {
            console.log(req.body.accountId);
            const acc = await Account.findOne({ _id: req.body.accountId });
            acc.password = req.body.newPassword;
            await acc.save();
            res.send({
                msg: `Update account ${req.body.accountId} successfully`,
            });
        } catch (err) {
            res.send(err);
        }
    }

    // [GET] /getAccount
    async getAccount(req, res, next) {
        try {
            console.log(req.body.accountId);
            const account = await Account.findOne({ _id: req.body.accountId });
            res.send({ accountId: account.id });
        } catch (err) {
            res.send(err);
        }
    }

    // [GET] /isAccountExist/:accountId
    async isAccountExist(req, res, next) {
        try {
            console.log(req.params.accountId);
            const account = await Account.findOne({
                _id: req.params.accountId,
            });
            if (account != null) {
                res.send({ exist: true });
            } else {
                res.send({ exist: false });
            }
        } catch (err) {
            res.send(err);
        }
    }

    // [DELETE] /logout
    async logout(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const refreshToken = authHeader && authHeader.split(' ')[1];
            await tokenController.removeRefreshToken(refreshToken);
            res.send({ msg: `Logout account successfully` });
        } catch (err) {
            res.send(err);
        }
    }
}

module.exports = new AccountController();

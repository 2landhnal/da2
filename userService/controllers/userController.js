const User = require('../models/user');
const jwt = require('jsonwebtoken');

class UserController {
    // [POST] /create
    async createUser(req, res, next) {
        try {
            const user = new User({
                accountId: req.body.accountId,
                name: req.body.name,
            });
            await user.save();
            res.send(user);
        } catch (err) {
            res.send(err);
        }
    }

    // [PUT] /update
    async updateUser(req, res, next) {
        try {
            const user = await User.findOne({ accountId: req.body.accountId });
            user.name = req.body.name;
            await user.save();
            res.send(user);
        } catch (err) {
            res.send(err);
        }
    }

    // [GET] /get
    async getUser(req, res, next) {
        try {
            const user = await User.findOne({ accountId: req.body.accountId });
            if (user) {
                res.send(user);
            } else {
                res.send({
                    msg: `User with id ${req.body.accountId} not found`,
                });
            }
        } catch (err) {
            res.send(err);
        }
    }

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, account) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.body.accountId = account.accountId;
            next();
        });
    }
}

module.exports = new UserController();

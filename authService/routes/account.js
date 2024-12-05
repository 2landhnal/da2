const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const tokenController = require('../controllers/tokenController');

// Login account
// REQUIRE: req.body include {username, password}
// RETURN: {accessToken, refreshToken}
router.post('/login', accountController.login);

// Create new account
// REQUIRE: req.body include {username, password, email}
// RETURN: {msg}
router.post('/create', accountController.create);

// Change password
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.body include {newPassword}
// RETURN: {msg}
router.put(
    '/update',
    tokenController.authenticateToken,
    accountController.update,
);

// Get account by id
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: account
router.get(
    '/getAccount',
    tokenController.authenticateToken,
    accountController.getAccount,
);

// Check if account with id exist
// REQUIRE: req.body.accountId
// RETURN: exist: bool
router.get('/isAccountExist/:accountId', accountController.getAccount);

// Log out, send refresh token with
// REQUIRE: req.body include {refreshToken}
// RETURN: {msg}
router.delete('/logout', accountController.logout);

// Get new access token
// REQUIRE: req.body include {refreshToken}
// RETURN: {accessToken}
router.post('/refreshAccessToken', tokenController.refreshAccessToken);

router.get('/', (req, res, next) => {
    res.send({ msg: 'Account service' });
});

module.exports = router;

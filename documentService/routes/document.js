const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('Authorization header missing');
        return res.sendStatus(401); // Unauthorized
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Token missing in Authorization header');
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, account) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.sendStatus(403); // Forbidden
        }
        req.body.accountId = account.accountId; // Debug: print well here
        console.log('Token verified successfully'); // Debug: already success here
        console.log(req.body.accountId);
        next();
    });
};
// Upload file
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// REQUIRE: req.file
// RETURN: {filePath, fileContent}
router.post(
    '/upload',
    upload.single('file'),
    authenticateToken,
    documentController.uploadFile, // Error here, after go through middleware, req.body.accountId = undefined
);

// Get all file
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: [{name,id,filePath,url}]
router.get('/get', authenticateToken, documentController.get);

// Get one file
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {fileName, fileContent}
router.get('/download/:id', authenticateToken, documentController.download);

// Delete file
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {message, fileName}
router.delete('/delete/:docId', documentController.deleteFile);

router.get('/', (req, res) => {
    res.json({ msg: 'Document service' });
});

module.exports = router;

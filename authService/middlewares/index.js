import express from 'express';
export const tokenDataMiddleware = (req, res, next) => {
    const tokenDataHeader = req.headers['x-token-data'];
    if (tokenDataHeader) {
        req.tokenData = JSON.parse(tokenDataHeader);
    } else {
        console.log('x-token-data header empty');
    }
    next();
};

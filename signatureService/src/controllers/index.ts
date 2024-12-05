/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import Signature from '../models/signature';
import jwt from 'jsonwebtoken';
import { get } from '../utils/httpRequests';
import crypto from 'crypto';

// Generate signature using ECDSA angorithm
const generateSignature = (accountId: string) => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: 'secp256k1',
    });

    const sign = crypto.createSign('SHA256');
    sign.update(accountId);
    const signature = sign.sign(privateKey, 'hex');

    return {
        privateKey: privateKey
            .export({ format: 'pem', type: 'pkcs8' })
            .toString(),
        publicKey: publicKey.export({ format: 'pem', type: 'spki' }).toString(),
        signature,
    };
};

class signatureController {
    // [POST] /create
    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            console.log('Create called');
            const accountId = req.body.accountId;
            const { privateKey, publicKey, signature } =
                generateSignature(accountId);
            const newSignature = new Signature({
                accountId: accountId,
                privateKey: privateKey,
                publicKey: publicKey,
                signature: signature,
            });
            await newSignature.save();
            res.json(newSignature);
        } catch (err: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    // [GET] /verify
    async verify(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            // get accountId from file
            const accountId = 'Sample';
            const ans = { isDocumentValid: false, accountId: accountId };
            if (accountId != null) {
                ans.isDocumentValid = true;
            }
            res.json(ans);
        } catch (err: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    // [GET] /getAll
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            console.log('Get all called');
            const accountId = req.body.accountId;
            const signatureLst = await Signature.find({ accountId });
            res.json(signatureLst);
        } catch (err: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    // [DELETE] /delete/:id
    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const signatureId = req.params.id;
            const signature = await Signature.findOne({ _id: signatureId });
            if (signature == null) {
                res.status(400).send({
                    msg: `Signature with id ${signatureId} not found.`,
                });
                return;
            }
            if (signature.accountId != req.body.accountId) {
                res.status(401).send({
                    msg: `You dont have permission to delete signature with id ${signatureId}.`,
                });
                return;
            }
            await Signature.deleteOne({ _id: signatureId });
            res.send({
                msg: `Deleted signature with id ${signatureId}.`,
            });
        } catch (err: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    // [PUT] /changeAlias/:signatureId/:alias
    async changeAlias(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        console.log('change alias called');
        try {
            const { signatureId, alias } = req.params;
            const signature = await Signature.findOne({ _id: signatureId });
            if (signature == null) {
                res.status(400).send({
                    msg: `Signature with id ${signatureId} not found.`,
                });
                return;
            }
            console.log(signature.accountId, req.body.accountId);
            if (signature.accountId != req.body.accountId) {
                res.status(401).send({
                    msg: `You dont have permission to update signature with id ${signatureId}.`,
                });
                return;
            }
            signature.alias = alias || signature.alias;
            await signature.save();
            res.send({
                msg: `Updated signature with id ${signatureId}.`,
            });
        } catch (err: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    // [PUT] /update
    async update(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const signatureId = req.body.signatureId;
            const alias = req.body.alias;
            const avatarURL = req.body.avatarURL;
            const signature = await Signature.findOne({ _id: signatureId });
            if (signature == null) {
                res.status(400).send({
                    msg: `Signature with id ${signatureId} not found.`,
                });
                return;
            }
            console.log(signature.accountId, req.body.accountId);
            if (signature.accountId != req.body.accountId) {
                res.status(401).send({
                    msg: `You dont have permission to update signature with id ${signatureId}.`,
                });
                return;
            }
            signature.alias = alias || signature.alias;
            signature.avatarUrl = avatarURL || signature.avatarUrl;
            await signature.save();
            res.send({
                msg: `Updated signature with id ${signatureId}.`,
            });
        } catch (err: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: err.message,
            });
        }
    }

    async isAccountExist(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const accountId = req.body.accountId;
            const authBaseUrl = process.env.AUTH_SERVICE_URL;
            let authRes = null;
            if (authBaseUrl != null) {
                authRes = await get(
                    authBaseUrl,
                    `/isAccountExist/${accountId}`,
                );
                console.log(authRes);
            }
            if (authRes == null || !authRes.exist) {
                res.status(403);
                return;
            }
            next();
        } catch (error: any) {
            res.status(500).send({
                msg: 'Internal Server Error',
                error: error.message,
            });
            return;
        }
    }

    async authenticateToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401);
            return;
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.SECRET_TOKEN_KEY as string,
            ) as { accountId: string };
            req.body.accountId = decoded.accountId;
            next();
        } catch (err) {
            console.error(err);
            res.status(403);
            res.send(err);
            return;
        }
    }
}

export default new signatureController();

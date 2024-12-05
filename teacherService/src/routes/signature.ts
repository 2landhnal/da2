/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import signatureController from '../controllers';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

// Create signature
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.post(
    '/create',
    signatureController.authenticateToken,
    signatureController.create,
);

// Delete signature
// REQUIRE: req.header.authorization = "Bearer {accessToken}"
// RETURN: {msg}
router.delete(
    '/delete/:id',
    signatureController.authenticateToken,
    signatureController.delete,
);

router.get(
    '/getAll',
    signatureController.authenticateToken,
    signatureController.getAll,
);

router.get(
    '/verify',
    signatureController.authenticateToken,
    signatureController.verify,
);

router.put(
    '/update',
    signatureController.authenticateToken,
    signatureController.update,
);

router.put(
    '/changeAlias/:signatureId/:alias',
    signatureController.authenticateToken,
    signatureController.changeAlias,
);

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send({ msg: 'signature service' });
});

export default router;

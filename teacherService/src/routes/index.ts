import express, { Router } from "express";
import signatureRoute from "./signature";

const router: Router = express.Router();

router.use("/", signatureRoute);

export default router;

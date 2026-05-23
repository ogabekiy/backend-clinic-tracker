import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateLogin } from "../validations/auth.validation.js";

const router = Router();

export const authEndpoints = [{ method: "POST", path: "/auth/login" }];

router.post("/login", validateLogin, authController.login);

export default router;


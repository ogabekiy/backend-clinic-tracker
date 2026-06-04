/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateLogin } from "../validations/auth.validation.js";

const router = Router();

export const authEndpoints = [
  { method: "POST", path: "/auth/login" },
];

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: Admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validateLogin,
  authController.login
);

export default router;
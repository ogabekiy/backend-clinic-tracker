/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: System audit logs endpoints
 */

import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as auditLogsController from "../controllers/audit-logs.controller.js";

const router = Router();

export const auditLogsEndpoints = [
  { method: "GET", path: "/audit-logs/all" },
];

router.use(authGuard);

/**
 * @swagger
 * /audit-logs/all:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_id:
 *                     type: integer
 *                     example: 5
 *                   action:
 *                     type: string
 *                     example: CREATE_PATIENT
 *                   entity:
 *                     type: string
 *                     example: patients
 *                   entity_id:
 *                     type: integer
 *                     example: 10
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-06-03T10:30:00.000Z
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin can access audit logs
 */
router.get(
  "/all",
  roleGuard("admin"),
  auditLogsController.getAuditLogs
);

export default router;
import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as auditLogsController from "../controllers/audit-logs.controller.js";

const router = Router();

export const auditLogsEndpoints = [{ method: "GET", path: "/audit-logs" }];

router.use(authGuard);

router.get("/all", roleGuard("admin"), auditLogsController.getAuditLogs);

export default router;


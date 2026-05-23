import * as auditLogsService from "../services/audit-logs.service.js";

export async function getAuditLogs(req, res, next) {
  try {
    const logs = await auditLogsService.getAuditLogs();
    res.json({ data: logs });
  } catch (error) {
    next(error);
  }
}


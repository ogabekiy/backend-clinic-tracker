import { createAuditLog } from "../../services/audit-logs.service.js";

const auditableMethods = ["POST", "PATCH", "DELETE"];
const skippedPaths = ["/auth/login"];

function getEntityType(path) {
  return path.split("/").filter(Boolean)[0] || null;
}

function getEntityId(req, responseBody) {
  return req.params?.id || responseBody?.data?.id || null;
}

export function auditMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  let responseBody;

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", async () => {
    const shouldAudit =
      auditableMethods.includes(req.method) &&
      !skippedPaths.includes(req.path) &&
      req.user &&
      res.statusCode >= 200 &&
      res.statusCode < 400;

    if (!shouldAudit) {
      return;
    }

    try {
      await createAuditLog({
        user_id: req.user.id,
        action: req.method,
        entity_type: getEntityType(req.baseUrl || req.path),
        entity_id: getEntityId(req, responseBody),
        old_values: null,
        new_values: {
          body: req.body,
          response: responseBody?.data || null,
        },
      });
    } catch (error) {
      console.error("Failed to create audit log", error);
    }
  });

  next();
}


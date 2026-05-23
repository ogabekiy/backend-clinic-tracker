import { ApiError } from "../utils/api-error.js";

export function roleGuard(...allowedRoles) {
  return function guardRole(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, "Authentication is required"));
    }

    if (req.user.role === "admin" || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return next(new ApiError(403, "You do not have permission for this action"));
  };
}


import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/tokens.js";

export function authGuard(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Access token is required");
    }

    const token = authHeader.split(" ")[1];
    req.user = verifyAccessToken(token);

    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, "Invalid access token"));
  }
}


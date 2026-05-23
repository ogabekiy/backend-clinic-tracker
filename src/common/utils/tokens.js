import jwt from "jsonwebtoken";
import { getConfig } from "../config/config.service.js";

const accessTokenExpiresIn = "15m";
const refreshTokenExpiresIn = "7d";

function getAccessSecret() {
  return getConfig("JWT_ACCESS_TOKEN");
}

function getRefreshSecret() {
  return getConfig("JWT_REFRESH_SECRET");
}

export function generateTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: jwt.sign(payload, getAccessSecret(), {
      expiresIn: accessTokenExpiresIn,
    }),
    refreshToken: jwt.sign(payload, getRefreshSecret(), {
      expiresIn: refreshTokenExpiresIn,
    }),
  };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getAccessSecret());
}


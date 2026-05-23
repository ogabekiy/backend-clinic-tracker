import bcrypt from "bcrypt";
import { pool } from "../common/database/database.service.js";
import { ApiError } from "../common/utils/api-error.js";
import { generateTokens } from "../common/utils/tokens.js";

export async function login({ email, password }) {
  const result = await pool.query(
    `
      SELECT id, first_name, last_name, email, role, password_hash, is_active
      FROM users
      WHERE email = $1
    `,
    [email]
  );

  const user = result.rows[0];

  if (!user || !user.is_active) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = generateTokens(user);

  delete user.password_hash;

  return {
    user,
    ...tokens,
  };
}


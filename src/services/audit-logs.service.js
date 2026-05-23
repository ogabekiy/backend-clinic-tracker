import { pool } from "../common/database/database.service.js";

export async function getAuditLogs() {
  const result = await pool.query(`
    SELECT
      id,
      user_id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      created_at
    FROM audit_logs
    ORDER BY created_at DESC
  `);

  return result.rows;
}

export async function createAuditLog(data) {
  const result = await pool.query(
    `
      INSERT INTO audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        old_values,
        new_values
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      data.user_id || null,
      data.action,
      data.entity_type || null,
      data.entity_id || null,
      data.old_values ? JSON.stringify(data.old_values) : null,
      data.new_values ? JSON.stringify(data.new_values) : null,
    ]
  );

  return result.rows[0];
}


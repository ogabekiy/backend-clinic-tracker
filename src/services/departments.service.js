import { pool } from "../common/database/database.service.js";

export async function getDepartments() {
  const result = await pool.query(`
    SELECT id, name, description
    FROM departments
    ORDER BY id ASC
  `);

  return result.rows;
}

export async function getDepartmentById(id) {
  const result = await pool.query(
    `
      SELECT id, name, description
      FROM departments
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export async function createDepartment(data) {
  const result = await pool.query(
    `
      INSERT INTO departments (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description
    `,
    [data.name, data.description || null]
  );

  return result.rows[0];
}

export async function updateDepartment(id, data) {
  const result = await pool.query(
    `
      UPDATE departments
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description)
      WHERE id = $3
      RETURNING id, name, description
    `,
    [data.name, data.description, id]
  );

  return result.rows[0];
}

export async function deleteDepartment(id) {
  const result = await pool.query(
    `
      DELETE FROM departments
      WHERE id = $1
      RETURNING id, name, description
    `,
    [id]
  );

  return result.rows[0];
}


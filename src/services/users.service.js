import bcrypt from "bcrypt";
import { pool } from "../common/database/database.service.js";

const saltRounds = 10;

export async function getUsers() {
  const result = await pool.query(`
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.role,
      u.is_active,
      d.id AS doctor_id,
      d.specialization,
      d.department_id,
      d.room_number,
      d.availability
    FROM users u
    LEFT JOIN doctors d ON d.user_id = u.id
    ORDER BY u.id ASC
  `);

  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query(
    `
      SELECT id, first_name, last_name, email, phone, role, is_active
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export async function createUser(userData) {
  const { first_name, last_name, email, phone, role, password, doctor_profile } =
    userData;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        INSERT INTO users (first_name, last_name, email, phone, role, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, first_name, last_name, email, phone, role, is_active
      `,
      [first_name, last_name, email, phone || null, role, passwordHash]
    );

    const user = result.rows[0];

    if (role === "doctor") {
      const doctorResult = await client.query(
        `
          INSERT INTO doctors (
            user_id,
            specialization,
            department_id,
            room_number,
            availability
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, specialization, department_id, room_number, availability
        `,
        [
          user.id,
          doctor_profile.specialization,
          doctor_profile.department_id,
          doctor_profile.room_number,
          doctor_profile.availability,
        ]
      );
      console.log("Doctor profile created:", doctorResult.rows[0]); // Debugging log

      user.doctor_profile = doctorResult.rows[0];
    }
    
    await client.query("COMMIT");

    return user;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateUser(id, userData) {
  const { first_name, last_name, email, phone, role, is_active } = userData;

  const result = await pool.query(
    `
      UPDATE users
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        role = COALESCE($5, role),
        is_active = COALESCE($6, is_active)
      WHERE id = $7
      RETURNING id, first_name, last_name, email, phone, role, is_active
    `,
    [first_name, last_name, email, phone, role, is_active, id]
  );

  return result.rows[0];
}

export async function deleteUser(id) {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, first_name, last_name, email, phone, role, is_active
    `,
    [id]
  );

  return result.rows[0];
}

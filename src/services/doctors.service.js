import { pool } from "../common/database/database.service.js";
import { ApiError } from "../common/utils/api-error.js";

export async function getDoctorByUserId(userId) {
  const result = await pool.query(
    `
      SELECT id, user_id, specialization, department_id, room_number, availability
      FROM doctors
      WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
}

export async function getDoctors(currentUser) {
  const params = [];
  let where = "";

  if (currentUser.role === "doctor") {
    params.push(currentUser.id);
    where = "WHERE d.user_id = $1";
  }

  const result = await pool.query(
    `
      SELECT
        d.id,
        d.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        d.specialization,
        d.department_id,
        dep.name AS department_name,
        d.room_number,
        d.availability
      FROM doctors d
      JOIN users u ON u.id = d.user_id
      LEFT JOIN departments dep ON dep.id = d.department_id
      ${where}
      ORDER BY d.id ASC
    `,
    params
  );

  return result.rows;
}

export async function getDoctorById(id, currentUser) {
  const result = await pool.query(
    `
      SELECT
        d.id,
        d.user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        d.specialization,
        d.department_id,
        dep.name AS department_name,
        d.room_number,
        d.availability
      FROM doctors d
      JOIN users u ON u.id = d.user_id
      LEFT JOIN departments dep ON dep.id = d.department_id
      WHERE d.id = $1
    `,
    [id]
  );

  const doctor = result.rows[0];

  if (doctor && currentUser.role === "doctor" && doctor.user_id !== currentUser.id) {
    throw new ApiError(403, "You can only access your own doctor profile");
  }

  return doctor;
}

export async function updateDoctor(id, data, currentUser) {
  const doctor = await getDoctorById(id, currentUser);

  if (!doctor) {
    return null;
  }

  const result = await pool.query(
    `
      UPDATE doctors
      SET
        specialization = COALESCE($1, specialization),
        department_id = COALESCE($2, department_id),
        room_number = COALESCE($3, room_number),
        availability = COALESCE($4, availability)
      WHERE id = $5
      RETURNING id, user_id, specialization, department_id, room_number, availability
    `,
    [
      data.specialization,
      data.department_id,
      data.room_number,
      data.availability,
      id,
    ]
  );

  return result.rows[0];
}

export async function deleteDoctor(id) {
  const result = await pool.query(
    `
      DELETE FROM doctors
      WHERE id = $1
      RETURNING id, user_id, specialization, department_id, room_number, availability
    `,
    [id]
  );

  return result.rows[0];
}


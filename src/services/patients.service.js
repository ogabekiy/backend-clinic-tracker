import { pool } from "../common/database/database.service.js";
import { ApiError } from "../common/utils/api-error.js";
import { getDoctorByUserId } from "./doctors.service.js";

async function getDoctorScope(currentUser) {
  if (currentUser.role !== "doctor") {
    return null;
  }

  const doctor = await getDoctorByUserId(currentUser.id);

  if (!doctor) {
    throw new ApiError(403, "Doctor profile is required");
  }

  return doctor;
}

export async function canAccessPatient(patientId, currentUser) {
  if (currentUser.role === "admin" || currentUser.role === "staff") {
    return true;
  }

  const doctor = await getDoctorScope(currentUser);
  const result = await pool.query(
    `
      SELECT id
      FROM patients
      WHERE id = $1 AND assigned_doctor_id = $2
    `,
    [patientId, doctor.id]
  );

  return result.rowCount > 0;
}

export async function getPatients(currentUser) {
  const doctor = await getDoctorScope(currentUser);
  const params = [];
  let where = "";

  if (doctor) {
    params.push(doctor.id);
    where = "WHERE p.assigned_doctor_id = $1";
  }

  const result = await pool.query(
    `
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.gender,
        p.phone,
        p.email,
        p.address,
        p.blood_type,
        p.assigned_doctor_id,
        p.created_at,
        p.updated_at
      FROM patients p
      ${where}
      ORDER BY p.id ASC
    `,
    params
  );

  return result.rows;
}

export async function getPatientById(id, currentUser) {
  const result = await pool.query(
    `
      SELECT
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        address,
        blood_type,
        assigned_doctor_id
      FROM patients
      WHERE id = $1
    `,
    [id]
  );

  const patient = result.rows[0];

  if (!patient) {
    return null;
  }

  if (!(await canAccessPatient(id, currentUser))) {
    throw new ApiError(403, "You can only access patients assigned to you");
  }

  return patient;
}

export async function createPatient(data) {
  const result = await pool.query(
    `
      INSERT INTO patients (
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        address,
        blood_type,
        assigned_doctor_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
    [
      data.first_name,
      data.last_name,
      data.date_of_birth,
      data.gender,
      data.phone,
      data.email,
      data.address,
      data.blood_type,
      data.assigned_doctor_id,
    ]
  );

  return result.rows[0];
}

export async function updatePatient(id, data) {
  const result = await pool.query(
    `
      UPDATE patients
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        date_of_birth = COALESCE($3, date_of_birth),
        gender = COALESCE($4, gender),
        phone = COALESCE($5, phone),
        email = COALESCE($6, email),
        address = COALESCE($7, address),
        blood_type = COALESCE($8, blood_type),
        assigned_doctor_id = COALESCE($9, assigned_doctor_id)
      WHERE id = $10
      RETURNING *
    `,
    [
      data.first_name,
      data.last_name,
      data.date_of_birth,
      data.gender,
      data.phone,
      data.email,
      data.address,
      data.blood_type,
      data.assigned_doctor_id,
      id,
    ]
  );

  return result.rows[0];
}

export async function deletePatient(id) {
  const result = await pool.query(
    `
      DELETE FROM patients
      WHERE id = $1
      RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}


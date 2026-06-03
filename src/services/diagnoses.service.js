import { pool } from "../common/database/database.service.js";
import { ApiError } from "../common/utils/api-error.js";
import { getDoctorByUserId } from "./doctors.service.js";
import { canAccessPatient,getPatientById } from "./patients.service.js";
async function resolveDoctorId(data, currentUser) {
  if (currentUser.role === "doctor") {
    const doctor = await getDoctorByUserId(currentUser.id);

    if (!doctor) {
      throw new ApiError(403, "Doctor profile is required");
    }

    return doctor.id;
  }

  if (!data.doctor_id) {
    throw new ApiError(400, "doctor_id is required");
  }

  return data.doctor_id;
}

export async function getDiagnoses(currentUser) {
  const params = [];
  let where = "";

  if (currentUser.role === "doctor") {
    const doctor = await getDoctorByUserId(currentUser.id);

    if (!doctor) {
      throw new ApiError(403, "Doctor profile is required");
    }

    params.push(doctor.id);
    where = "WHERE d.doctor_id = $1";
  }

  const result = await pool.query(
  `
    SELECT
      d.id,
      d.patient_id,
      CONCAT(p.first_name, ' ', p.last_name) AS patient_name,

      d.icd_code,
      d.description,
      d.severity,
      d.notes,

      d.doctor_id,
      CONCAT(u.first_name, ' ', u.last_name) AS doctor_name

    FROM diagnoses d
    JOIN patients p
      ON d.patient_id = p.id

    JOIN doctors doc
      ON d.doctor_id = doc.id

    JOIN users u
      ON doc.user_id = u.id

    ${where}
    ORDER BY d.id DESC
  `,
  params
);

  return result.rows;
}

export async function getDiagnosisById(id, currentUser) {
  const result = await pool.query(
    `
      SELECT id, patient_id, icd_code, description, severity, notes, doctor_id
      FROM diagnoses
      WHERE id = $1
    `,
    [id]
  );

  const diagnosis = result.rows[0];

  if (!diagnosis) {
    return null;
  }

  if (!(await canAccessPatient(diagnosis.patient_id, currentUser))) {
    throw new ApiError(403, "You can only access diagnoses for your patients");
  }

  return diagnosis;
}

export async function createDiagnosis(data, currentUser) {
  if (!(await canAccessPatient(data.patient_id, currentUser))) {
    throw new ApiError(403, "You can only create diagnoses for your patients");
  }

  const doctor = await getDoctorByUserId(currentUser.id);

  if (!doctor) {
    throw new ApiError(403, "Doctor profile is required");
  }

  const patient = await getPatientById(data.patient_id, currentUser);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const doctorId = await resolveDoctorId(data, currentUser);

  const result = await pool.query(
    `
      INSERT INTO diagnoses (
        patient_id,
        icd_code,
        description,
        severity,
        notes,
        doctor_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, patient_id, icd_code, description, severity, notes, doctor_id
    `,
    [
      data.patient_id,
      data.icd_code,
      data.description,
      data.severity,
      data.notes,
      doctorId,
    ]
  );

  return result.rows[0];
}

export async function updateDiagnosis(id, data, currentUser) {
  await getDiagnosisById(id, currentUser);

  const result = await pool.query(
    `
      UPDATE diagnoses
      SET
        icd_code = COALESCE($1, icd_code),
        description = COALESCE($2, description),
        severity = COALESCE($3, severity),
        notes = COALESCE($4, notes)
      WHERE id = $5
      RETURNING id, patient_id, icd_code, description, severity, notes, doctor_id
    `,
    [data.icd_code, data.description, data.severity, data.notes, id]
  );

  return result.rows[0];
}

export async function deleteDiagnosis(id, currentUser) {
  await getDiagnosisById(id, currentUser);

  const result = await pool.query(
    `
      DELETE FROM diagnoses
      WHERE id = $1
      RETURNING id, patient_id, icd_code, description, severity, notes, doctor_id
    `,
    [id]
  );

  return result.rows[0];
}


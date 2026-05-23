import { pool } from "../common/database/database.service.js";
import { ApiError } from "../common/utils/api-error.js";
import { canAccessPatient } from "./patients.service.js";
import fs from "fs/promises";
import path from "path";
export async function getMedicalDocuments(currentUser) {
  const result = await pool.query(`
    SELECT id, patient_id, upload_by, files, description
    FROM medical_documents
    ORDER BY id DESC
  `);

  if (currentUser.role === "admin" || currentUser.role === "staff") {
    return result.rows;
  }

  const documents = [];

  for (const document of result.rows) {
    if (await canAccessPatient(document.patient_id, currentUser)) {
      documents.push(document);
    }
  }

  return documents;
}

export async function getMedicalDocumentById(id, currentUser) {
  const result = await pool.query(
    `
      SELECT id, patient_id, upload_by, files, description
      FROM medical_documents
      WHERE id = $1
    `,
    [id]
  );

  const document = result.rows[0];

  if (!document) {
    return null;
  }

  if (!(await canAccessPatient(document.patient_id, currentUser))) {
    throw new ApiError(403, "You can only access documents for your patients");
  }

  return document;
}

export async function createMedicalDocument(data, currentUser) {
  if (!(await canAccessPatient(data.patient_id, currentUser))) {
    throw new ApiError(403, "You can only upload documents for your patients");
  }

  const result = await pool.query(
    `
      INSERT INTO medical_documents (patient_id, upload_by, files, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id, patient_id, upload_by, files, description
    `,
    [
      data.patient_id,
      currentUser.id,
      JSON.stringify(data.files),
      data.description || null,
    ]
  );

  return result.rows[0];
}

export async function deleteMedicalDocument(id, currentUser) {
  const document = await getMedicalDocumentById(id, currentUser);

  console.log("Document to delete:", document);

  // Real fayllarni o‘chirish
  if (document.files && Array.isArray(document.files)) {
    for (const file of document.files) {
      try {
        const filePath = path.resolve(file.path);

        await fs.unlink(filePath);

        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete file: ${file.path}`, error.message);
      }
    }
  }

  // DB dan documentni o‘chirish
  const result = await pool.query(
    `
      DELETE FROM medical_documents
      WHERE id = $1
      RETURNING id, patient_id, upload_by, files, description
    `,
    [id]
  );

  return result.rows[0];
}


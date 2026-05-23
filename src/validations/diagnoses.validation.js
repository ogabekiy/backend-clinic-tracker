const allowedSeverity = ["low", "medium", "high", "critical"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateDiagnosis(req, res, next) {
  const errors = [];
  const { patient_id, icd_code, description, severity, notes, doctor_id } =
    req.body || {};

  if (!patient_id) {
    errors.push("patient_id is required");
  }

  if (severity !== undefined && !allowedSeverity.includes(severity)) {
    errors.push(`severity must be one of: ${allowedSeverity.join(", ")}`);
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }

  if (notes !== undefined && typeof notes !== "string") {
    errors.push("notes must be a string");
  }

  if (icd_code !== undefined && typeof icd_code !== "string") {
    errors.push("icd_code must be a string");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  req.body = {
    patient_id,
    icd_code: isNonEmptyString(icd_code) ? icd_code.trim() : null,
    description: isNonEmptyString(description) ? description.trim() : null,
    severity: severity || "low",
    notes: isNonEmptyString(notes) ? notes.trim() : null,
    doctor_id: doctor_id || null,
  };

  next();
}


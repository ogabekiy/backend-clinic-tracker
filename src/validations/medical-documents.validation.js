export function validateCreateMedicalDocument(req, res, next) {
  const errors = [];

  if (!req.body?.patient_id) {
    errors.push("patient_id is required");
  }

  if (!req.files || req.files.length === 0) {
    errors.push("at least one file is required");
  }

  if (req.body?.description && typeof req.body.description !== "string") {
    errors.push("description must be a string");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  req.body = {
    patient_id: req.body.patient_id,
    description: req.body.description?.trim() || null,
  };

  next();
}


const allowedGenders = ["male", "female", "other"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreatePatient(req, res, next) {
  const errors = [];
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    blood_type,
    assigned_doctor_id,
  } = req.body || {};

  if (!isNonEmptyString(first_name)) {
    errors.push("first_name is required");
  }

  if (!isNonEmptyString(last_name)) {
    errors.push("last_name is required");
  }

  if (!isNonEmptyString(date_of_birth)) {
    errors.push("date_of_birth is required");
  }

  if (!isNonEmptyString(gender)) {
    errors.push("gender is required");
  } else if (!allowedGenders.includes(gender)) {
    errors.push(`gender must be one of: ${allowedGenders.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  req.body = {
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    date_of_birth,
    gender,
    phone: phone?.trim() || null,
    email: email?.trim().toLowerCase() || null,
    address: address?.trim() || null,
    blood_type: blood_type?.trim() || null,
    assigned_doctor_id: assigned_doctor_id || null,
  };

  next();
}


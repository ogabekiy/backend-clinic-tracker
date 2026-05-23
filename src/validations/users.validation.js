const allowedRoles = ["admin", "doctor", "staff"];
const allowedAvailability = ["available", "busy", "offline"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCreateUser(req, res, next) {
  const errors = [];
  const {
    first_name,
    last_name,
    email,
    phone,
    role,
    password,
    doctor_profile,
  } = req.body || {};

  if (!isNonEmptyString(first_name)) {
    errors.push("first_name is required");
  }

  if (!isNonEmptyString(last_name)) {
    errors.push("last_name is required");
  }

  if (!isNonEmptyString(email)) {
    errors.push("email is required");
  } else if (!isValidEmail(email)) {
    errors.push("email must be valid");
  }

  if (!isNonEmptyString(role)) {
    errors.push("role is required");
  } else if (!allowedRoles.includes(role)) {
    errors.push(`role must be one of: ${allowedRoles.join(", ")}`);
  }

  if (!isNonEmptyString(password)) {
    errors.push("password is required");
  } else if (password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  if (phone !== undefined && typeof phone !== "string") {
    errors.push("phone must be a string");
  }

  if (role === "doctor") {
    if (!doctor_profile || typeof doctor_profile !== "object") {
      errors.push("doctor_profile is required when role is doctor");
    } else {
      if (!isNonEmptyString(doctor_profile.specialization)) {
        errors.push("doctor_profile.specialization is required");
      }

      if (
        doctor_profile.availability !== undefined &&
        !allowedAvailability.includes(doctor_profile.availability)
      ) {
        errors.push(
          `doctor_profile.availability must be one of: ${allowedAvailability.join(", ")}`
        );
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  req.body = {
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    role,
    password,
    doctor_profile:
      role === "doctor"
        ? {
            specialization: doctor_profile.specialization.trim(),
            department_id: doctor_profile.department_id || null,
            room_number: doctor_profile.room_number?.trim() || null,
            availability: doctor_profile.availability || "available",
          }
        : null,
  };

  next();
}

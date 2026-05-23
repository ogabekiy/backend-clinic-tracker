function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateLogin(req, res, next) {
  const errors = [];
  const { email, password } = req.body || {};

  if (!isNonEmptyString(email)) {
    errors.push("email is required");
  }

  if (!isNonEmptyString(password)) {
    errors.push("password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  req.body = {
    email: email.trim().toLowerCase(),
    password,
  };

  next();
}


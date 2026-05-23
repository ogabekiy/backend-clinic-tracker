function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateDepartment(req, res, next) {
  const errors = [];
  const { name, description } = req.body || {};

  if (!isNonEmptyString(name)) {
    errors.push("name is required");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  req.body = {
    name: name.trim(),
    description: description?.trim() || null,
  };

  next();
}


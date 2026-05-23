import * as departmentsService from "../services/departments.service.js";

export async function getDepartments(req, res, next) {
  try {
    const departments = await departmentsService.getDepartments();
    res.json({ data: departments });
  } catch (error) {
    next(error);
  }
}

export async function getDepartmentById(req, res, next) {
  try {
    const department = await departmentsService.getDepartmentById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ data: department });
  } catch (error) {
    next(error);
  }
}

export async function createDepartment(req, res, next) {
  try {
    const department = await departmentsService.createDepartment(req.body);
    res.status(201).json({ data: department });
  } catch (error) {
    next(error);
  }
}

export async function updateDepartment(req, res, next) {
  try {
    const department = await departmentsService.updateDepartment(
      req.params.id,
      req.body
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ data: department });
  } catch (error) {
    next(error);
  }
}

export async function deleteDepartment(req, res, next) {
  try {
    const department = await departmentsService.deleteDepartment(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({ data: department });
  } catch (error) {
    next(error);
  }
}


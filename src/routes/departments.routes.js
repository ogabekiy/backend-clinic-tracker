import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as departmentsController from "../controllers/departments.controller.js";
import { validateCreateDepartment } from "../validations/departments.validation.js";

const router = Router();

export const departmentsEndpoints = [
  { method: "GET", path: "/departments/all" },
  { method: "GET", path: "/departments/:id" },
  { method: "POST", path: "/departments/create" },
  { method: "PATCH", path: "/departments/update/:id" },
  { method: "DELETE", path: "/departments/delete/:id" },
];

router.use(authGuard);

router.get("/all", departmentsController.getDepartments);
router.get("/:id", departmentsController.getDepartmentById);
router.post(
  "/create",
  roleGuard("admin"),
  validateCreateDepartment,
  departmentsController.createDepartment
);
router.patch("/update/:id", roleGuard("admin"), departmentsController.updateDepartment);
router.delete("/delete/:id", roleGuard("admin"), departmentsController.deleteDepartment);

export default router;


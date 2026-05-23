import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as patientsController from "../controllers/patients.controller.js";
import { validateCreatePatient } from "../validations/patients.validation.js";

const router = Router();

export const patientsEndpoints = [
  { method: "GET", path: "/patients/all" },
  { method: "GET", path: "/patients/:id" },
  { method: "POST", path: "/patients/create" },
  { method: "PATCH", path: "/patients/update/:id" },
  { method: "DELETE", path: "/patients/delete/:id" },
];

router.use(authGuard);

router.get("/all", roleGuard("doctor", "staff"), patientsController.getPatients);
router.get("/:id", roleGuard("doctor", "staff"), patientsController.getPatientById);
router.post(
  "/create",
  roleGuard("staff"),
  validateCreatePatient,
  patientsController.createPatient
);
router.patch("/update/:id", roleGuard("staff"), patientsController.updatePatient);
router.delete("/delete/:id", roleGuard("staff"), patientsController.deletePatient);

export default router;


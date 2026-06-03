import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as diagnosesController from "../controllers/diagnoses.controller.js";
import { validateCreateDiagnosis } from "../validations/diagnoses.validation.js";

const router = Router();

export const diagnosesEndpoints = [
  { method: "GET", path: "/diagnoses/all" },
  { method: "GET", path: "/diagnoses/:id" },
  { method: "POST", path: "/diagnoses/create" },
  { method: "PATCH", path: "/diagnoses/update/:id" },
  { method: "DELETE", path: "/diagnoses/delete/:id" },
];

router.use(authGuard);

router.get("/create", roleGuard("doctor", "staff","admin"), diagnosesController.getDiagnoses);
router.get("/all", roleGuard("doctor", "staff","admin"), diagnosesController.getDiagnoses);
router.get("/:id", roleGuard("doctor", "staff","admin"), diagnosesController.getDiagnosisById);
router.post(
  "/create",
  roleGuard("doctor"),
  validateCreateDiagnosis,
  diagnosesController.createDiagnosis
);
router.patch("/update/:id", roleGuard("doctor"), diagnosesController.updateDiagnosis);
router.delete("/delete/:id", roleGuard("doctor"), diagnosesController.deleteDiagnosis);

export default router;


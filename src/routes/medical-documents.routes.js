import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import { upload } from "../common/upload/upload.service.js";
import * as medicalDocumentsController from "../controllers/medical-documents.controller.js";
import { validateCreateMedicalDocument } from "../validations/medical-documents.validation.js";

const router = Router();

export const medicalDocumentsEndpoints = [
  { method: "GET", path: "/medical-documents/all" },
  { method: "GET", path: "/medical-documents/:id" },
  { method: "POST", path: "/medical-documents/create" },
  { method: "DELETE", path: "/medical-documents/delete/:id" },
];

router.use(authGuard);

router.get(
  "/all",
  roleGuard("doctor", "staff","admin"),
  medicalDocumentsController.getMedicalDocuments
);
router.get(
  "/:id",
  roleGuard("doctor", "staff","admin"),
  medicalDocumentsController.getMedicalDocumentById
);
router.post(
  "/create",
  roleGuard("doctor","admin"),
  upload.array("files", 10),
  validateCreateMedicalDocument,
  medicalDocumentsController.createMedicalDocument
);
router.delete(
  "/delete/:id",
  roleGuard("doctor","admin"),
  medicalDocumentsController.deleteMedicalDocument
);

export default router;


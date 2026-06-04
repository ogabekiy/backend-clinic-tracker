/**
 * @swagger
 * tags:
 *   name: Medical Documents
 *   description: Medical document management endpoints
 */

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

/**
 * @swagger
 * /medical-documents/all:
 *   get:
 *     summary: Get all medical documents
 *     tags: [Medical Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Medical documents retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/all",
  roleGuard("doctor", "staff", "admin"),
  medicalDocumentsController.getMedicalDocuments
);

/**
 * @swagger
 * /medical-documents/{id}:
 *   get:
 *     summary: Get medical document by ID
 *     tags: [Medical Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Medical document retrieved successfully
 *       404:
 *         description: Medical document not found
 */
router.get(
  "/:id",
  roleGuard("doctor", "staff", "admin"),
  medicalDocumentsController.getMedicalDocumentById
);

/**
 * @swagger
 * /medical-documents/create:
 *   post:
 *     summary: Create medical document with file uploads
 *     tags: [Medical Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - diagnosis_id
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               diagnosis_id:
 *                 type: integer
 *                 example: 3
 *               notes:
 *                 type: string
 *                 example: Patient condition is stable
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Medical document created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/create",
  roleGuard("doctor", "admin"),
  upload.array("files", 10),
  validateCreateMedicalDocument,
  medicalDocumentsController.createMedicalDocument
);

/**
 * @swagger
 * /medical-documents/delete/{id}:
 *   delete:
 *     summary: Delete medical document
 *     tags: [Medical Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Medical document deleted successfully
 *       404:
 *         description: Medical document not found
 */
router.delete(
  "/delete/:id",
  roleGuard("doctor", "admin"),
  medicalDocumentsController.deleteMedicalDocument
);

export default router;
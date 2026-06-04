/**
 * @swagger
 * tags:
 *   name: Diagnoses
 *   description: Diagnosis management endpoints
 */

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

/**
 * @swagger
 * /diagnoses/all:
 *   get:
 *     summary: Get all diagnoses
 *     tags: [Diagnoses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diagnoses retrieved successfully
 */
router.get(
  "/all",
  roleGuard("doctor", "staff", "admin"),
  diagnosesController.getDiagnoses
);

/**
 * @swagger
 * /diagnoses/{id}:
 *   get:
 *     summary: Get diagnosis by ID
 *     tags: [Diagnoses]
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
 *         description: Diagnosis retrieved successfully
 *       404:
 *         description: Diagnosis not found
 */
router.get(
  "/:id",
  roleGuard("doctor", "staff", "admin"),
  diagnosesController.getDiagnosisById
);

/**
 * @swagger
 * /diagnoses/create:
 *   post:
 *     summary: Create diagnosis
 *     tags: [Diagnoses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 example: 1
 *               doctor_id:
 *                 type: integer
 *                 example: 2
 *               diagnosis:
 *                 type: string
 *                 example: Hypertension
 *               notes:
 *                 type: string
 *                 example: Patient should reduce salt intake
 *     responses:
 *       201:
 *         description: Diagnosis created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/create",
  roleGuard("doctor"),
  validateCreateDiagnosis,
  diagnosesController.createDiagnosis
);

/**
 * @swagger
 * /diagnoses/update/{id}:
 *   patch:
 *     summary: Update diagnosis
 *     tags: [Diagnoses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Diagnosis updated successfully
 *       404:
 *         description: Diagnosis not found
 */
router.patch(
  "/update/:id",
  roleGuard("doctor"),
  diagnosesController.updateDiagnosis
);

/**
 * @swagger
 * /diagnoses/delete/{id}:
 *   delete:
 *     summary: Delete diagnosis
 *     tags: [Diagnoses]
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
 *         description: Diagnosis deleted successfully
 *       404:
 *         description: Diagnosis not found
 */
router.delete(
  "/delete/:id",
  roleGuard("doctor"),
  diagnosesController.deleteDiagnosis
);

export default router;
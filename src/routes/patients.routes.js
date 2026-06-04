/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management endpoints
 */

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

/**
 * @swagger
 * /patients/all:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/all",
  roleGuard("doctor", "staff", "admin"),
  patientsController.getPatients
);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
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
 *         description: Patient retrieved successfully
 *       404:
 *         description: Patient not found
 */
router.get(
  "/:id",
  roleGuard("doctor", "staff", "admin"),
  patientsController.getPatientById
);

/**
 * @swagger
 * /patients/create:
 *   post:
 *     summary: Create patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               gender:
 *                 type: string
 *                 example: male
 *               address:
 *                 type: string
 *                 example: Tashkent
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/create",
  roleGuard("staff", "admin"),
  validateCreatePatient,
  patientsController.createPatient
);

/**
 * @swagger
 * /patients/update/{id}:
 *   patch:
 *     summary: Update patient
 *     tags: [Patients]
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
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 */
router.patch(
  "/update/:id",
  roleGuard("staff", "admin"),
  patientsController.updatePatient
);

/**
 * @swagger
 * /patients/delete/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
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
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 */
router.delete(
  "/delete/:id",
  roleGuard("staff", "admin"),
  patientsController.deletePatient
);

export default router;
/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management endpoints
 */

import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as doctorsController from "../controllers/doctors.controller.js";

const router = Router();

export const doctorsEndpoints = [
  { method: "GET", path: "/doctors/all" },
  { method: "GET", path: "/doctors/get/:id" },
  { method: "PATCH", path: "/doctors/update/:id" },
  { method: "DELETE", path: "/doctors/delete/:id" },
];

router.use(authGuard);

/**
 * @swagger
 * /doctors/all:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/all",
  roleGuard("doctor", "staff"),
  doctorsController.getDoctors
);

/**
 * @swagger
 * /doctors/get/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
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
 *         description: Doctor retrieved successfully
 *       404:
 *         description: Doctor not found
 */
router.get(
  "/get/:id",
  roleGuard("doctor", "staff"),
  doctorsController.getDoctorById
);

/**
 * @swagger
 * /doctors/update/{id}:
 *   patch:
 *     summary: Update doctor
 *     tags: [Doctors]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department_id:
 *                 type: integer
 *                 example: 2
 *               specialization:
 *                 type: string
 *                 example: Cardiologist
 *               experience_years:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       404:
 *         description: Doctor not found
 */
router.patch(
  "/update/:id",
  roleGuard("doctor", "admin"),
  doctorsController.updateDoctor
);

/**
 * @swagger
 * /doctors/delete/{id}:
 *   delete:
 *     summary: Delete doctor
 *     tags: [Doctors]
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
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 */
router.delete(
  "/delete/:id",
  roleGuard("admin"),
  doctorsController.deleteDoctor
);

export default router;
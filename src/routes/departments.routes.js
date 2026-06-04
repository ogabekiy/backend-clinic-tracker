/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management endpoints
 */

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

/**
 * @swagger
 * /departments/all:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/all", departmentsController.getDepartments);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
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
 *         description: Department retrieved successfully
 *       404:
 *         description: Department not found
 */
router.get("/:id", departmentsController.getDepartmentById);

/**
 * @swagger
 * /departments/create:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cardiology
 *               description:
 *                 type: string
 *                 example: Department responsible for heart-related treatments
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  "/create",
  roleGuard("admin"),
  validateCreateDepartment,
  departmentsController.createDepartment
);

/**
 * @swagger
 * /departments/update/{id}:
 *   patch:
 *     summary: Update department
 *     tags: [Departments]
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
 *               name:
 *                 type: string
 *                 example: Neurology
 *               description:
 *                 type: string
 *                 example: Department specializing in nervous system disorders
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 *       403:
 *         description: Forbidden
 */
router.patch(
  "/update/:id",
  roleGuard("admin"),
  departmentsController.updateDepartment
);

/**
 * @swagger
 * /departments/delete/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
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
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/delete/:id",
  roleGuard("admin"),
  departmentsController.deleteDepartment
);

export default router;
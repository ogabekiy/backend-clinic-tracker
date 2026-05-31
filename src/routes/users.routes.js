import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as usersController from "../controllers/users.controller.js";
import { validateCreateUser } from "../validations/users.validation.js";

const router = Router();

export const usersEndpoints = [
  { method: "GET", path: "/users/all" },
  { method: "GET", path: "/users/:id" },
  { method: "GET", path: "/users/role/:role" },
  { method: "POST", path: "/users/create" },
  { method: "PATCH", path: "/users/:id" },
  { method: "DELETE", path: "/users/:id" },
];

router.use(authGuard);

router.get("/all", roleGuard("admin"), usersController.getUsers);
router.get("/role/:role", roleGuard("admin","staff"), usersController.getUsersByRole);
router.get("/:id", roleGuard("admin"), usersController.getUserById);
router.post(
  "/create",
  validateCreateUser,
  usersController.createUser
);
router.patch("/update/:id", roleGuard("admin"), usersController.updateUser);
router.delete("/delete/:id", roleGuard("admin"), usersController.deleteUser);

export default router;

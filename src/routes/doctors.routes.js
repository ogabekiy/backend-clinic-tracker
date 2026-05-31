import { Router } from "express";
import { authGuard } from "../common/guards/auth.guard.js";
import { roleGuard } from "../common/guards/role.guard.js";
import * as doctorsController from "../controllers/doctors.controller.js";

const router = Router();

export const doctorsEndpoints = [
  { method: "GET", path: "/doctors/all" },
  { method: "GET", path: "/doctors/:id" },
  { method: "PATCH", path: "/doctors/update/:id" },
  { method: "DELETE", path: "/doctors/delete/:id" },
];

router.use(authGuard);

router.get("/all", roleGuard("doctor", "staff"), doctorsController.getDoctors);
router.get("/get/:id", roleGuard("doctor", "staff"), doctorsController.getDoctorById);
router.patch("/update/:id", roleGuard("doctor",'admin'), doctorsController.updateDoctor);
router.delete("/delete/:id", roleGuard("admin"), doctorsController.deleteDoctor);

export default router;


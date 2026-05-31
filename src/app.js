import express from "express";
import { initDatabase } from "./common/database/database.service.js";
import { auditMiddleware } from "./common/middlewares/audit.middleware.js";
import { errorMiddleware } from "./common/middlewares/error.middleware.js";
import { notFoundMiddleware } from "./common/middlewares/not-found.middleware.js";
import { printEndpoints } from "./common/utils/print-endpoints.js";
import auditLogsRoutes, {
  auditLogsEndpoints,
} from "./routes/audit-logs.routes.js";
import authRoutes, { authEndpoints } from "./routes/auth.routes.js";
import departmentsRoutes, {
  departmentsEndpoints,
} from "./routes/departments.routes.js";
import diagnosesRoutes, { diagnosesEndpoints } from "./routes/diagnoses.routes.js";
import doctorsRoutes, { doctorsEndpoints } from "./routes/doctors.routes.js";
import medicalDocumentsRoutes, {
  medicalDocumentsEndpoints,
} from "./routes/medical-documents.routes.js";
import patientsRoutes, { patientsEndpoints } from "./routes/patients.routes.js";
import usersRoutes, { usersEndpoints } from "./routes/users.routes.js";
import cors from "cors";
const app = express();

await initDatabase();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Clinic API is running" });
});

app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);
app.use(auditMiddleware);
app.use("/users", usersRoutes);
app.use("/departments", departmentsRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/patients", patientsRoutes);
app.use("/diagnoses", diagnosesRoutes);
app.use("/medical-documents", medicalDocumentsRoutes);
app.use("/audit-logs", auditLogsRoutes);

printEndpoints([
  { method: "GET", path: "/" },
  ...authEndpoints,
  ...usersEndpoints,
  ...departmentsEndpoints,
  ...doctorsEndpoints,
  ...patientsEndpoints,
  ...diagnosesEndpoints,
  ...medicalDocumentsEndpoints,
  ...auditLogsEndpoints,
]);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;

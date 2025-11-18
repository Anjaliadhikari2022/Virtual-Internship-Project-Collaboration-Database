import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import internshipsRouter from "./routes/internships.js";
import applicationsRouter from "./routes/applications.js";
import mentorRouter from "./routes/mentor.js";
import projectsRouter from "./routes/projects.js";
import tasksRouter from "./routes/tasks.js";
import resourcesRouter from "./routes/resources.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");
    res.json({ status: "ok", db: rows[0].result });
  } catch (err) {
    console.error("Health check failed", err);
    res.status(500).json({ status: "error" });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/internships", internshipsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/mentor", mentorRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/resources", resourcesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/tasks/student/:studentId - tasks assigned to a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [rows] = await pool.query(
      `SELECT t.task_id,
              t.project_id,
              t.description,
              t.deadline,
              t.status,
              p.title AS project_title
         FROM tasks t
         LEFT JOIN projects p ON t.project_id = p.project_id
        WHERE t.assigned_to = ?
        ORDER BY t.deadline ASC, t.task_id DESC`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching student tasks", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/tasks/project/:projectId - tasks for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await pool.query(
      `SELECT t.task_id,
              t.project_id,
              t.description,
              t.deadline,
              t.status,
              t.assigned_to,
              u.name AS assigned_to_name
         FROM tasks t
         LEFT JOIN users u ON t.assigned_to = u.user_id
        WHERE t.project_id = ?
        ORDER BY t.deadline ASC, t.task_id DESC`,
      [projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching project tasks", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

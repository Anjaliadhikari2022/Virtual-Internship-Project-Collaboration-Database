import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/projects/student/:studentId - projects where student is in team
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [rows] = await pool.query(
      `SELECT DISTINCT
         p.project_id,
         p.title,
         p.description,
         p.start_date,
         p.end_date,
         p.mentor_id,
         t.role_in_team
       FROM projects p
       JOIN team t ON p.project_id = t.project_id
      WHERE t.student_id = ?
      ORDER BY p.start_date DESC, p.project_id DESC`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching student projects", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/projects/mentor/:mentorId - projects owned by mentor
router.get("/mentor/:mentorId", async (req, res) => {
  try {
    const { mentorId } = req.params;

    const [rows] = await pool.query(
      `SELECT p.project_id,
              p.title,
              p.description,
              p.start_date,
              p.end_date,
              p.mentor_id
         FROM projects p
        WHERE p.mentor_id = ?
        ORDER BY p.start_date DESC, p.project_id DESC`,
      [mentorId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching mentor projects", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/projects/:projectId/team - team members for a project
router.get("/:projectId/team", async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await pool.query(
      `SELECT t.team_id,
              t.role_in_team,
              u.user_id,
              u.name,
              u.email
         FROM team t
         JOIN users u ON t.student_id = u.user_id
        WHERE t.project_id = ?
        ORDER BY u.name`,
      [projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching project team", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/mentor/:id/students - students/applications for a mentor's internships
router.get("/:id/students", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT DISTINCT
         u.user_id,
         u.name,
         u.email,
         u.skills,
         a.status AS application_status,
         i.title AS internship_title,
         i.internship_id
       FROM applications a
       JOIN internships i ON a.internship_id = i.internship_id
       JOIN users u ON a.student_id = u.user_id
      WHERE i.mentor_id = ?
      ORDER BY u.name`,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching mentor students", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/mentor/:id/summary - high-level stats for mentor dashboard
router.get("/:id/summary", async (req, res) => {
  try {
    const { id } = req.params;

    // Assigned students: distinct students who applied to this mentor's internships
    const [assignedRows] = await pool.query(
      `SELECT COUNT(DISTINCT a.student_id) AS assignedStudents
         FROM applications a
         JOIN internships i ON a.internship_id = i.internship_id
        WHERE i.mentor_id = ?`,
      [id]
    );

    // Active projects: internships belonging to this mentor
    const [projectRows] = await pool.query(
      `SELECT COUNT(*) AS activeProjects
         FROM internships
        WHERE mentor_id = ?`,
      [id]
    );

    // Pending reviews: applications with status 'pending' for this mentor's internships
    const [pendingRows] = await pool.query(
      `SELECT COUNT(*) AS pendingReviews
         FROM applications a
         JOIN internships i ON a.internship_id = i.internship_id
        WHERE i.mentor_id = ?
          AND a.status = 'pending'`,
      [id]
    );

    res.json({
      assignedStudents: assignedRows[0]?.assignedStudents ?? 0,
      activeProjects: projectRows[0]?.activeProjects ?? 0,
      pendingReviews: pendingRows[0]?.pendingReviews ?? 0,
    });
  } catch (err) {
    console.error("Error fetching mentor summary", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

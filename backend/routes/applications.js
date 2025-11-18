import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// POST /api/applications - create new application
router.post("/", async (req, res) => {
  try {
    const { student_id, internship_id, status = "applied" } = req.body;

    if (!student_id || !internship_id) {
      return res.status(400).json({ message: "student_id and internship_id are required" });
    }

    // optional: ensure internship exists
    const [internships] = await pool.query(
      "SELECT internship_id FROM internships WHERE internship_id = ?",
      [internship_id]
    );
    if (internships.length === 0) {
      return res.status(404).json({ message: "Internship not found" });
    }

    const [result] = await pool.query(
      "INSERT INTO applications (student_id, internship_id, status) VALUES (?, ?, ?)",
      [student_id, internship_id, status]
    );

    res.status(201).json({
      message: "Application submitted",
      application_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating application", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/applications?student_id=123 - list applications for a student
router.get("/", async (req, res) => {
  try {
    const { student_id } = req.query;

    if (!student_id) {
      return res.status(400).json({ message: "student_id query parameter is required" });
    }

    const [rows] = await pool.query(
      `SELECT a.application_id, a.status, a.internship_id,
              i.title AS internship_title, i.company_name
         FROM applications a
         JOIN internships i ON a.internship_id = i.internship_id
        WHERE a.student_id = ?
        ORDER BY a.application_id DESC`,
      [student_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching applications", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

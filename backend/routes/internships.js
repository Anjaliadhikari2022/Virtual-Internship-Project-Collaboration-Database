import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/internships - list all internships
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT internship_id, title, description, company_name, duration, start_date, end_date, mentor_id FROM internships"
    );

    const mapped = rows.map((row) => ({
      id: row.internship_id,
      title: row.title,
      description: row.description,
      company: row.company_name,
      duration: row.duration ? `${row.duration} months` : null,
      start_date: row.start_date,
      end_date: row.end_date,
      mentor_id: row.mentor_id,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Error fetching internships", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

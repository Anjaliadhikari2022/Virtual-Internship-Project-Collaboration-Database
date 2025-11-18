import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET /api/resources/project/:projectId - resources for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const [rows] = await pool.query(
      `SELECT r.resource_id,
              r.project_id,
              r.file_link,
              r.description,
              r.uploaded_by,
              u.name AS uploaded_by_name
         FROM resources r
         LEFT JOIN users u ON r.uploaded_by = u.user_id
        WHERE r.project_id = ?
        ORDER BY r.resource_id DESC`,
      [projectId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching project resources", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

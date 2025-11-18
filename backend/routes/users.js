import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/users/:id - get single user profile
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT user_id, name, email, role, skills FROM users WHERE user_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user profile", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

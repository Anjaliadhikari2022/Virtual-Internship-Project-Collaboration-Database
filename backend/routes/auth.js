import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role = "student", skills = null } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // check if user already exists
    const [existing] = await pool.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, skills) VALUES (?, ?, ?, ?, ?)",
      [name, email, password, role, skills]
    );

    return res.status(201).json({
      message: "Signup successful",
      user: { user_id: result.insertId, name, email, role, skills }
    });
  } catch (err) {
    console.error("Error in signup", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await pool.query(
      "SELECT user_id, name, email, role, skills FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({ message: "Login successful", user: rows[0] });
  } catch (err) {
    console.error("Error in login", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

import express from "express";
import { fetchAllUsers, fetchUserById } from "../utils/users.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error getting users",
    });
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  try {
    const user = await fetchUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error getting user" });
  }
});

export default router;

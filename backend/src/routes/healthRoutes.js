// backend/src/routes/healthRoutes.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/health", async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  };

  res.status(200).json(health);
});

export default router;

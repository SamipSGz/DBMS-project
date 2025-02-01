const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "CFPS API is working!" });
  });

  router.get("/cfps", async (req, res) => {
    try {
      const [result] = await db.query("SELECT * FROM CFP"); // Use async/await instead of callbacks
      console.log(result);
      res.json(result);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred while fetching conferences" });
    }
  });

  return router;
};

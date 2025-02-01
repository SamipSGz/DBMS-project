const express = require("express");
const authenticationToken = require("../authentication/authMiddleware");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "CFPS API is working!" });
  });

  router.get("/cfps", async (req, res) => {
    try {
      const [result] = await db.query("SELECT * FROM CFP");
      res.json(result);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred while fetching CFPs" });
    }
  });

  router.post("/submit", authenticationToken, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
      const submitted_By = req.user.personId; // Assuming personId is available in user object
      const { title, cfp_id, topic } = req.body;

      // Input validation
      if (!title || !cfp_id || !topic) {
        return res.status(400).json({ 
          message: "Missing required fields" 
        });
      }

      // Verify that the topic exists in Category table
      const [topicExists] = await connection.query(
        'SELECT 1 FROM Category WHERE Topic = ?',
        [topic]
      );

      if (!topicExists.length) {
        return res.status(400).json({
          message: "Invalid topic category"
        });
      }

      // Verify that the CFP exists and is still open
      const [cfpExists] = await connection.query(
        'SELECT 1 FROM CFP WHERE CFP_ID = ? AND Deadline >= CURRENT_DATE',
        [cfp_id]
      );

      if (!cfpExists.length) {
        return res.status(400).json({
          message: "Invalid or expired CFP"
        });
      }

      await connection.beginTransaction();

      // Insert into Paper table
      const [paperResult] = await connection.query(
        'INSERT INTO Paper (Title, Topic) VALUES (?, ?)',
        [title, topic]
      );

      const paper_ID = paperResult.insertId;

      // Insert into Submission table
      await connection.query(
        'INSERT INTO Submission (Submission_Date, Status, Paper_ID, CFP_ID, Submitted_By) VALUES (CURRENT_DATE, ?, ?, ?, ?)',
        ['Waiting', paper_ID, cfp_id, submitted_By]
      );

      await connection.commit();

      res.status(201).json({
        message: "Paper submission successful",
        paper_id: paper_ID
      });

    } catch (error) {
      await connection.rollback();
      console.error("Submission error:", error);
      
      res.status(500).json({
        message: "Failed to submit paper",
        error: error.message
      });
    } finally {
      connection.release();
    }
  });

  return router;
};
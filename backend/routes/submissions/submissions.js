const express = require("express");
const authenticationToken = require("../authentication/authMiddleware");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "Submissions API is working!" });
  });

  // Get all submissions
  router.get("/submissions", authenticationToken, async (req, res) => {
    try {
      const submitted_By = req.user.userId;
      
      
      const query = `
        SELECT s.Submission_ID, p.Title AS Paper_Title, c.Title AS CFP_Title, s.Status, s.Submission_Date
        FROM Submission s
        LEFT JOIN CFP c ON c.CFP_ID = s.CFP_ID
        LEFT JOIN Paper p ON p.Paper_ID = s.Paper_ID
        WHERE s.Submitted_By = ?
      `;

      const [result] = await db.query(query, [submitted_By]); // Corrected query parameter placement
      ////console.log(result);
      res.json(result);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred while fetching submissions" });
    }
  });

  return router; // Added return to ensure router is exported correctly
};

const express = require("express");
const authenticationToken = require("../authentication/authMiddleware");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "Reviews API is working!" });
  });

  // Get all reviews
  router.get("/reviews", authenticationToken, async (req, res) => {
    try {
      const role = req.user.role;

      const query = `
        SELECT s.Submission_ID, p.Title AS Paper_Title, c.Title AS CFP_Title, AVG(r.Review_Score) AS Average_Rating
        FROM Submission s
        LEFT JOIN CFP c ON c.CFP_ID = s.CFP_ID
        LEFT JOIN Paper p ON p.Paper_ID = s.Paper_ID
        LEFT JOIN Reviews r ON r.Paper_ID = p.Paper_ID 
        WHERE s.Status = 'Approved'
        GROUP BY s.Submission_ID, p.Title, c.Title, r.Paper_ID
      `;

      const [result] = await db.query(query); // Corrected query parameter placement
      console.log(result);
      res.json(result);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred while fetching submissions" });
    }
  });

  return router; // Added return to ensure router is exported correctly
};

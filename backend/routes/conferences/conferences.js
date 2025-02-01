const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "Conference API is working!" });
  });

  // Get all conferences
  router.get("/conferences", async (req, res) => {
    try {
      const query = `
        SELECT c.Conference_ID, c.Name, c.Theme, c.Location, c.Start_Date, c.End_Date, 
               f.CFP_ID, f.Title AS CFP_Title, f.Topic
        FROM Conference c
        LEFT JOIN CFP f ON c.Conference_ID = f.Conference_ID
      `;
      const [result] = await db.query(query); // Use async/await instead of callbacks
      console.log(result);
      res.json(result);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred while fetching conferences" });
    }
  });

  return router;
};

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
               f.CFP_ID, f.Title AS CFP_Title, f.Topic, f.Announced_Date
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

  // Add new conference and associated CFPs
  router.post("/add", async (req, res) => {
    const { Name, Theme, Location, Start_Date, End_Date, CFPs } = req.body;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [conferenceResult] = await connection.query(
        `INSERT INTO Conference (Name, Theme, Location, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?)`,
        [Name, Theme, Location, Start_Date, End_Date]
      );
      
      const conferenceID = conferenceResult.insertId;
      
      for (const cfp of CFPs) {
        await connection.query(
          `INSERT INTO CFP (Conference_ID, Title, Topic) VALUES (?, ?, ?)`,
          [conferenceID, cfp.CFP_Title, cfp.Topic]
        );
      }

      await connection.commit();
      res.status(201).json({ Conference_ID: conferenceID, Name, Theme, Location, Start_Date, End_Date, CFPs });
    } catch (err) {
      await connection.rollback();
      console.error(err);
      res.status(500).json({ message: "Failed to add conference" });
    } finally {
      connection.release();
    }
  });

  return router;
};

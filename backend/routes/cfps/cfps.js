const express = require("express");
const multer = require("multer");
const authenticationToken = require("../authentication/authMiddleware");
const router = express.Router();

// Configure multer to handle file uploads but store nothing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = (db) => {
  router.get("/test", (req, res) => {
    ////console.log("GET /test called");
    res.json({ message: "CFPS API is working!" });
  });

  router.get("/cfps", async (req, res) => {
    ////console.log("GET /cfps called");
    try {
      const [result] = await db.query("SELECT * FROM CFP");
      ////console.log("CFPs fetched successfully");
      res.json(result);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).json({ message: "An error occurred while fetching CFPs" });
    }
  });

  router.post("/submit", 
    authenticationToken, 
    upload.single('file'), // Handle the file upload
    async (req, res) => {

      const userRole = req.user.role;
      const submitted_By = req.user.userId;

      ////console.log("About to Check if the submitter is now allowed to be a Reviewer.");
      if(userRole == 'Author')
      {////console.log("Checking if the submitter is now allowed to be a Reviewer.");
      const query2 = `
        SELECT COUNT(*)
        FROM Submission s
        WHERE s.Submitted_By = ?
      `;
      const [result2] = await db.query(query2, [submitted_By]); // Corrected query parameter placement
      ////console.log("Number of Submissions:", result2);
      const totalSubmissions = result2[0]['COUNT(*)'];
      ////console.log("Number of Submissions:", totalSubmissions);

      if(totalSubmissions > 2){
        ////console.log("Changing to Reviewer.");
        const query3 = `
          UPDATE Person
          SET Role = 'Reviewer'
          WHERE PersonID = ?
        `;
        const [result3] = await db.query(query3,[submitted_By]);
        ////console.log("Update Successful");
      }}

      ////console.log("POST /submit called");
      // ////console.log(req);
      const connection = await db.getConnection();
      try {
        ////console.log("Authentication passed:", req.user);
        const { title, cfp_id, topic, file } = req.body;
        
        ////console.log("Received data:", { title, cfp_id, topic, file });
        
        // Input validation
        if (!title || !cfp_id || !topic) {
          console.warn("Missing required fields:", { title, cfp_id, topic });
          return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Verify topic exists
        const [topicExists] = await connection.query(
          'SELECT 1 FROM Category WHERE Topic = ?',
          [topic]
        );
        
        ////console.log("Topic exists check:", topicExists);
        
        if (!topicExists.length) {
          console.warn("Invalid topic category:", topic);
          return res.status(400).json({ message: "Invalid topic category" });
        }
        
        // Verify cfp_id exists
        const [cfpId] = await connection.query(
          'SELECT 1 FROM CFP WHERE CFP_ID = ?',
          [cfp_id]
        );
        
        ////console.log("CFP_ID exists check:", cfpId);
        
        if (!cfpId.length) {
          console.warn("Invalid CFP_Id :", cfp_id);
          return res.status(400).json({ message: "Invalid CFP_ID" });
        }
        
        // Verify person exists
        const submitted_By = req.user.userId;
        ////console.log("userId:", submitted_By);
        
        ////console.log("PersonID exists check:", submitted_By);
        
        if (!submitted_By) {
          console.warn("Invalid Person with PersonID :", submitted_By);
          return res.status(400).json({ message: "Invalid PersonID" });
        }

        await connection.beginTransaction();
        ////console.log("Transaction started");

        // Insert into Paper table
        const [paperResult] = await connection.query(
          'INSERT INTO Paper (Title, Topic) VALUES (?, ?)',
          [title, topic]
        );

        ////console.log("Inserted Paper:", paperResult);

        const paper_ID = paperResult.insertId;

        // Insert into Submission table
        await connection.query(
          // // For Testing since we need to use the Person Table for login and not the user. Ani retrieve personID when inserting.
          // 'INSERT INTO Submission (Submission_Date, Status, Paper_ID, CFP_ID, Submitted_By) VALUES (CURRENT_DATE, ?, 1, 9, 1)',
          // ['Waiting']
          'INSERT INTO Submission (Submission_Date, Status, Paper_ID, CFP_ID, Submitted_By) VALUES (CURRENT_DATE, ?, ?, ?, ?)',
          ['Waiting', paper_ID, cfp_id, req.user.userId]
        );

        ////console.log("Inserted Submission");

        await connection.commit();
        ////console.log("Transaction committed");

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
        ////console.log("Database connection released");
      }
    }
  );

  return router;
};

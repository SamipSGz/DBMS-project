const express = require("express");
const authenticationToken = require("../authentication/authMiddleware")
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

  router.post("/submit",authenticationToken,async(req,res) => {
    const submitted_By = req.user.username;
    // const {Title, Topic, Cfp_ID} = req.body
    const {Title, Topic, Cfp_ID, FILE} = req.body
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      const [cfpResult] = await connection.query(
        'INSERT INTO Paper(Title, Topic) VALUES (? , ?)',
        [Title, Topic]
      );
      const paper_ID = cfpResult.insertId;
      const [cfpResult2] = await connection.query(
        'INSERT INTO Submission(Submission_Date, Status, Paper_ID, CFP_ID, Submitted_By) VALUES (?, ?)',
        [CURRENT_DATE, "Waiting", paper_ID, Cfp_ID, submitted_By]
      );
      await  connection.commit();
      res.status(201).json({message:"Paper Submission Successful."});

    } catch (erro){
      await connection.rollback();
      console.error(error);
      res.status(500).json({message:"Internal Server Error"});
    }
  });
  

  return router;
};

const express = require("express");
const authenticationToken = require("../authentication/authMiddleware");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "Reviews API is working!" });
  });

  
  router.get("/reviews", authenticationToken, async (req, res) => {
    try {
      // console.log("HERE", req.body);
      // //console.log("HERE", req.user);
      const role = req.user.role;
      const submissionID = req.body['submissionId'];

      // //console.log(role);
      if (role == "Reviewer") {
      const query = `
        SELECT s.Submission_ID, p.Title AS Paper_Title, c.Title AS CFP_Title, AVG(r.Review_Score) AS Average_Rating
        FROM Submission s
        LEFT JOIN CFP c ON c.CFP_ID = s.CFP_ID
        LEFT JOIN Paper p ON p.Paper_ID = s.Paper_ID
        LEFT JOIN Reviews r ON r.Paper_ID = p.Paper_ID 
        WHERE s.Status = 'Waiting' AND s.Submitted_By != ?
        GROUP BY s.Submission_ID, p.Title, c.Title, r.Paper_ID
      `;

      const [result] = await db.query(query,[submissionID]); // Corrected query parameter placement
      // console.log(result);
      res.json(result);
      } else if(role == "Author") {
        res.status(403).json({ message: "You are not authorized review other's papers" });
      }
    } catch (err) {
      
      res.status(500).json({ message: "An error occurred while fetching submissions" });
    }
  });

  router.post("/submit",authenticationToken,async(req,res)=>{
    try{
      temp = req.body;
      console.log(temp);
      
      const submissionID = req.body['submissionId'];
      console.log(submissionID);
      
      const [papers] = await db.query(`
        SELECT Paper_ID FROM Submission WHERE Submission_ID = ?
        `,[submissionID]);
      console.log(papers);
      paperID = papers[0]['Paper_ID'];
      console.log("PAPER ID : ",paperID);
      // res.json({message:"Review submitted successfully"});
      // const ratings = req.body.ratings;
      const average = parseInt(Object.values(req.body.ratings).reduce((a,b)=>a+b,0)/Object.keys(req.body.ratings).length);
      // res.json({message:average});

      const connection = await db.getConnection();
      await connection.beginTransaction();
      console.log("Connection Successful.");
      const query = `
        INSERT INTO Reviews (Review_Score,Paper_ID,Submission_ID) VALUES
        (?,?,?)`
      const [result] = await connection.query(query,[average,paperID,submissionID]);

      await connection.commit();

      const no_of_reviews_array = await db.query(`
        SELECT COUNT(*) FROM Reviews WHERE Paper_ID = ?
      `,[paperID]);
      const average_review_rating_array = await db.query(`
        SELECT AVG(Review_Score) FROM Reviews WHERE Paper_ID = ?
      `,[paperID]);
      const no_of_reviews = no_of_reviews_array[0][0]['COUNT(*)'];
      const average_review_rating = average_review_rating_array[0][0]['AVG(Review_Score)'];
      if(no_of_reviews > 2 && average_review_rating > 30){
        await db.query(`
          UPDATE Submission
          SET Status = 'Approved'
          WHERE Paper_ID = ?
        `,[paperID]); 
      }
      if(no_of_reviews > 2 && average_review_rating<30){
        await db.query(`
          UPDATE Submission
          SET Status = 'Rejected'
          WHERE Paper_ID = ?
        `,[paperID]);
      }
      

      res.status(201).json({
        message: "Paper review successful",
        paper_id: paperID
      });


    }catch(err){
      console.error("Here2 Database query error:", err);
      console.error(err.response.data);    // ***
      console.error(err.response.status);  // ***
      console.error(err.response.headers);
    }
  })

  return router; // Added return to ensure router is exported correctly
};

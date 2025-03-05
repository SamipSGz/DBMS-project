const express = require("express");
// const authenticationToken = require("../authientication/authMiddleware");
const router = express.Router();

module.exports = (db) => {
    router.get("/test",(req,res)=>{
        res.json({message:"Dashboard API is working!"});
    });

    router.get("/dashboard",/*authenticationToke,*/async(req,res)=>{
        try{
            // const role = req.user.role;
            // const userId = req.user.userId;
            ////console.log("Role:",role);
            ////console.log("User ID:",userId);
            // if(role == "Author"){
                const activeCFPQuery = `
                    SELECT COUNT(cf.CFP_ID)
                    FROM CFP cf
                    WHERE cf.Announced_Date < NOW() AND cf.Submission_Deadline > NOW()
                `;
                const totalSubmissionsQuery = `
                    SELECT COUNT(s.Submission_ID)
                    FROM Submission s
                `;
                const upcomingConferencesQuery = `
                    SELECT COUNT(co.Conference_ID) 
                    FROM Conference co
                    WHERE co.Start_Date > NOW()
                `;
                const noOfReviewersQuery = `
                    SELECT COUNT(p.PersonID) 
                    FROM Person p
                    WHERE p.Role = 'Reviewer'
                `;
                const recentSubmissionQuery = `
                    SELECT s.Submission_ID, p.Title AS Paper_Title,pe.Name AS Author_Name, s.Status, s.Submission_Date
                    FROM Submission s
                    LEFT JOIN Paper p ON p.Paper_ID = s.Paper_ID
                    LEFT JOIN Person pe ON pe.PersonID = s.Submitted_By
                    ORDER BY s.Submission_Date DESC
                    LIMIT 5
                `;
                const upcomingDeadlines = `
                    SELECT cf.CFP_ID,cf.Title,cf.Submission_Deadline
                    FROM CFP cf
                    WHERE cf.Submission_Deadline > NOW()
                    ORDER BY cf.Submission_Deadline ASC
                    LIMIT 5`
                


                const [activeCFPResult] = await db.query(activeCFPQuery);
                const [totalSubmissionsResult] = await db.query(totalSubmissionsQuery); 
                const [upcomingConferencesResult] = await db.query(upcomingConferencesQuery);   
                const [noOfReviewersResult] = await db.query(noOfReviewersQuery);   
                const [recentSubmissionResult] = await db.query(recentSubmissionQuery);
                const [upcomingDeadlinesResult] = await db.query(upcomingDeadlines);
                //console.log("Dashboard data fetched successfully");
                ////console.log("Submissions fetched successfully");
                res.json({
                    activeCFP:activeCFPResult[0]['COUNT(cf.CFP_ID)'],
                    totalSubmissions:totalSubmissionsResult[0]['COUNT(s.Submission_ID)'],
                    upcomingConferences:upcomingConferencesResult[0]['COUNT(co.Conference_ID)'],
                    noOfReviewers:noOfReviewersResult[0]['COUNT(p.PersonID)'],
                    recentSubmissions:recentSubmissionResult,
                    upcomingDeadlines:upcomingDeadlinesResult
                });
            
            // }
        }catch(err){
            console.error("Database query error:",err);
            res.status(500).json({message:"An error occurred while fetching dashboard data"});
        }
    });
    return router;
};
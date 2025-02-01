const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "Conference API is working!" });
  });

  // Get all conferences
  router.get("/", (req, res) => {
    const query = "SELECT * FROM conferences";
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).send("An error occurred while fetching conferences");
      } else {
        console.log(result);
        res.json(result);
      }
    });
  });

  return router;
};

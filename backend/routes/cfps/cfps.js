const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/test", (req, res) => {
    res.json({ message: "CFPS API is working!" });
  });

  return router;
};

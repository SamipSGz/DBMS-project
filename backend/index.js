const express = require('express');
const bodyParser = require('body-parser'); // Add this line to require body-parser
const mysql = require('mysql');
const cors = require('cors');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createPool({
  connectionLimit: 10,
  host: "sql12.freesqldatabase.com",
  user: "sql12760610",
  password: "HTlPjpuQYb",
  database: "sql12760610",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  //   res.send("Hello World!");
  db.query("INSERT INTO Conference (Name, Theme, Location, Start_Date, End_Date) VALUES ('Tech Innovators Summit', 'Future of AI', 'San Francisco, CA', '2025-04-15', '2025-04-17');", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});
app.get("/selectConference", (req, res) => {
  db.query("SELECT * FROM Conference", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

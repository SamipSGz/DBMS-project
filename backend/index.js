const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 10,
  host: "sql12.freesqldatabase.com",
  user: "sql12760610",
  password: "HTlPjpuQYb",
  database: "sql12760610",
});

// Import routes
const userRoutes = require('./routes/users/users')(db);
const conferenceRoutes = require('./routes/conferences/conferences');
const cfpRoutes = require('./routes/cfps/cfps');

// Use routes
app.use('/users', userRoutes);
app.use('/conferences', conferenceRoutes);
app.use('/cfps', cfpRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
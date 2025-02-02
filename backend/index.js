const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
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
const conferenceRoutes = require('./routes/conferences/conferences')(db);
const cfpRoutes = require('./routes/cfps/cfps')(db);
const submissionsRoutes = require('./routes/submissions/submissions')(db);
const reviewsRoutes = require('./routes/reviews/reviews')(db);

// Use routes
app.use('/users', userRoutes);
app.use('/conferences', conferenceRoutes);
app.use('/cfps', cfpRoutes);
app.use('/submissions', submissionsRoutes);
app.use('/reviews', reviewsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
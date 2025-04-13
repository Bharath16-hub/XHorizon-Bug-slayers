const express = require('express');
const mysql = require('mysql');
const app = express();

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zerowaste'
});
db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Get available food posts
app.get('/available_food_posts', (req, res) => {
  const sql = "SELECT * FROM food_posts WHERE status = 'available'";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send("Error fetching data");
    }

    res.json(result);  // Send result as JSON
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

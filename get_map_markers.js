const express = require('express');
const mysql = require('mysql');
const app = express();

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zerowaste'
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Route to get food post map data
app.get('/map_posts', (req, res) => {
  const sql = "SELECT id, donor_name, latitude, longitude, expiry, status FROM food_posts";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query failed" });
    }

    const now = Date.now();

    const data = results.map(row => {
      const expiryTime = new Date(row.expiry).getTime();
      let status;

      if (row.status === 'picked') {
        status = 'picked';
      } else if (expiryTime < now) {
        status = 'expired';
      } else if (expiryTime - now < 3600 * 1000) {
        status = 'near_expiry';
      } else {
        status = 'fresh';
      }

      return {
        ...row,
        status
      };
    });

    res.json(data);
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

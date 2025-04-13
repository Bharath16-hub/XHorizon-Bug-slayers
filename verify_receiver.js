const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// POST route to verify email
app.post('/verify-email', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT * FROM ngos_volunteers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).send("Server error");
    }

    res.send(results.length > 0 ? 'valid' : 'invalid');
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

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

// Update post status route
app.post('/update_post_status', (req, res) => {
  const postId = req.body.post_id;

  if (!postId) {
    return res.status(400).send("Post ID is required");
  }

  const sql = "UPDATE food_posts SET status = 'accepted' WHERE id = ?";
  db.query(sql, [postId], (err, result) => {
    if (err) return res.status(500).send("Error updating post status");

    res.send("Post status updated to accepted");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

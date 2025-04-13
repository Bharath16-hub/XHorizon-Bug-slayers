const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zerowaste'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// POST route to accept a food post
app.post('/accept-post', (req, res) => {
  if (!req.session.receiver) {
    return res.status(401).send('Unauthorized access');
  }

  const { post_id } = req.body;

  const query = 'UPDATE food_posts SET status = "accepted" WHERE id = ?';
  db.query(query, [post_id], (err) => {
    if (err) {
      console.error('Error updating status:', err);
      return res.status(500).send('Server error');
    }

    // Optional: redirect or send a success response
    res.redirect('/dashboard'); // Adjust route as per your frontend
    // Or: res.send("Post accepted successfully");
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

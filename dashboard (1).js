const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// DB Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zerowaste'
});

db.connect(err => {
  if (err) console.error('DB Error:', err);
  else console.log('Connected to MySQL');
});

// Route: Receiver Dashboard
app.get('/receiver/dashboard', (req, res) => {
  if (!req.session.receiver) {
    return res.redirect('/login.html');
  }

  const query = "SELECT * FROM food_posts WHERE status = 'available'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('DB Error');

    res.render('receiver_dashboard', {
      username: req.session.receiver,
      foodPosts: results
    });
  });
});

// POST route to accept donation (can reuse from earlier)
app.post('/accept-donation', (req, res) => {
  const { post_id } = req.body;
  if (!req.session.receiver) return res.status(403).send('Unauthorized');

  const query = 'UPDATE food_posts SET status = "accepted" WHERE id = ?';
  db.query(query, [post_id], (err) => {
    if (err) return res.status(500).send('Error updating');
    res.redirect('/receiver/dashboard');
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

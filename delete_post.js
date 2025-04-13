const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
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

// Session middleware for checking if admin is logged in
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is an admin
function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  return res.send("Unauthorized");
}

// Delete food post route
app.post('/delete_post', isAdmin, (req, res) => {
  const id = req.body.id;

  if (!id) return res.status(400).send("Post ID is required");

  const sql = "DELETE FROM food_posts WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send("Error deleting post");
    
    res.redirect('/dashboard'); // Redirect to dashboard after deletion
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

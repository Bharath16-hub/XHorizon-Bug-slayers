const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// Receiver login POST route
app.post('/receiver/login', (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM ngos_volunteers WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    if (result.length > 0) {
      req.session.receiver = email;
      res.redirect('/receiver/dashboard');
    } else {
      res.send(`<script>alert('Unauthorized: Email not found'); window.location.href='/receiver/login';</script>`);
    }
  });
});

// Dummy dashboard route for redirect
app.get('/receiver/dashboard', (req, res) => {
  if (!req.session.receiver) {
    return res.redirect('/receiver/login');
  }
  res.send(`<h2>Welcome, ${req.session.receiver} 👋</h2><p>This is your dashboard.</p>`);
});

// Receiver login page (static or rendered view)
app.get('/receiver/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'receiver_login.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

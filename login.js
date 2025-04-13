const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true
}));

// DB connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zerowaste'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to DB');
});

// Route to show login page
app.get('/receiver/login', (req, res) => {
  res.render('receiver_login');
});

// Route to verify receiver
app.post('/receiver/login', (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM ngos_volunteers WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).send('Database error');
    
    if (results.length > 0) {
      req.session.receiver = email;
      res.redirect('/receiver/dashboard');
    } else {
      res.send(`<script>alert('Invalid email'); window.location.href='/receiver/login';</script>`);
    }
  });
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

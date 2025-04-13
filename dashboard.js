const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Middleware to protect admin routes
function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  return res.redirect('/login.html');
}

// Simulated login route for demo
app.get('/login', (req, res) => {
  req.session.admin = true;
  res.redirect('/dashboard');
});

// Dashboard route
app.get('/dashboard', isAdmin, (req, res) => {
  db.query("SELECT SUM(quantity) AS total_food, COUNT(*) AS total_posts FROM food_posts WHERE status != 'expired'", (err, reportResults) => {
    if (err) return res.send("Database error in report");

    const food_kg = reportResults[0].total_food || 0;
    const people_served = Math.round(food_kg * 2);
    const co2_saved = Math.round(food_kg * 2.5);

    db.query("SELECT * FROM food_posts ORDER BY expiry ASC", (err, posts) => {
      if (err) return res.send("Error loading food posts");

      db.query("SELECT * FROM ngos_volunteers", (err, ngos) => {
        if (err) return res.send("Error loading NGOs");

        res.render('dashboard', {
          food_kg, people_served, co2_saved,
          posts, ngos
        });
      });
    });
  });
});

// Add NGO/Volunteer POST route
app.post('/add_ngo', isAdmin, (req, res) => {
  const { name, email, phone, role, location } = req.body;
  const sql = "INSERT INTO ngos_volunteers (name, email, phone, role, location) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, phone, role, location], (err) => {
    if (err) return res.send("Error adding NGO/Volunteer");
    res.redirect('/dashboard');
  });
});

// Delete food post
app.post('/delete_post', isAdmin, (req, res) => {
  const id = req.body.id;
  db.query("DELETE FROM food_posts WHERE id = ?", [id], (err) => {
    if (err) return res.send("Error deleting post");
    res.redirect('/dashboard');
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

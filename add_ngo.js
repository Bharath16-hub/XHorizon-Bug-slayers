const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret
    resave: false,
    saveUninitialized: true
}));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zerowaste'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Authentication Middleware
function isAdmin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        return res.status(401).send("Unauthorized");
    }
}

// POST route to insert NGO/Volunteer
app.post('/add', isAdmin, (req, res) => {
    const { name, email, phone, role, location } = req.body;

    const sql = "INSERT INTO ngos_volunteers (name, email, phone, role, location) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [name, email, phone, role, location], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).send("Database error");
        }
        res.redirect('/dashboard');
    });
});

// Example admin login simulation (for testing)
app.get('/login', (req, res) => {
    req.session.admin = true;
    res.send("Logged in as admin");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

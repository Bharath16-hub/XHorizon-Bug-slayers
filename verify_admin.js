const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Hardcoded valid credentials
const validUser = "admin";
const validPass = "zerowaste123"; // You can hash this later

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === validUser && password === validPass) {
    req.session.admin = true;  // Create a session for the admin user
    return res.redirect('/dashboard'); // Redirect to the dashboard
  } else {
    return res.send("<script>alert('Invalid credentials'); window.location.href='/login';</script>");
  }
});

// Sample dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.admin) {
    return res.redirect('/login');  // Redirect to login if not authenticated
  }
  res.send("<h1>Welcome to the Admin Dashboard</h1>");
});

// Sample login page route
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

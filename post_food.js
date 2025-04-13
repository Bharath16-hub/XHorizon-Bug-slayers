const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const app = express();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zerowaste'
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("MySQL connected");
});

// Middleware for parsing JSON (excluding file uploads)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// POST route to handle form submission with image
app.post('/donate', upload.single('image'), (req, res) => {
  const {
    donor_name, email, food_type, category,
    quantity, expiry, lat, lng
  } = req.body;

  let image_path = '';
  if (req.file) {
    image_path = 'uploads/' + req.file.filename;
  }

  const sql = `
    INSERT INTO food_posts 
    (donor_name, email, food_type, category, quantity, expiry, latitude, longitude, image_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [donor_name, email, food_type, category, quantity, expiry, lat, lng, image_path];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Error: " + err.message);
    }
    res.send("Success: Donation Posted");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

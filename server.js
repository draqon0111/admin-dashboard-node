const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "admin_db"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});

// Add Student
app.post("/add-student", (req, res) => {
  const { name, email, phone, age, gender, course, address } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!emailRegex.test(email)) {
    return res.send("Invalid email address");
  }

  if (!phoneRegex.test(phone)) {
    return res.send("Phone number must be exactly 10 digits");
  }

  const sql = `
    INSERT INTO students 
    (name, email, phone, age, gender, course, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, phone, age, gender, course, address], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error adding student");
    }

    res.redirect("/success.html");
  });
});

// Add Product
app.post("/add-product", (req, res) => {
  const { name, price, description } = req.body;

  const sql = `
    INSERT INTO products 
    (name, price, description) 
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, price, description], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error adding product");
    }

    res.send("Product added successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
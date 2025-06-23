const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "event_registration",
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    process.exit(1); // Exit if connection fails
  }
  console.log("Connected to MySQL database");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/register", (req, res) => {
  const { name, email, phone, event } = req.body;

  const sql = "INSERT INTO registrations (name, email, phone, event) VALUES (?, ?, ?, ?)";
  const values = [name, email, phone, event];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Error registering. Please try again.");
    }

    res.send(
      `<h1>Thank you for registering, ${name}!</h1><p><a href="/">Go back</a></p>`
    );
  });
});

// Gracefully close DB connection on server termination
process.on("SIGINT", () => {
  db.end((err) => {
    if (err) console.error("Error closing MySQL connection:", err);
    else console.log("MySQL connection closed.");
    process.exit();
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

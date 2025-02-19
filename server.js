const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Your MySQL username
    password: "", // Your MySQL password
    database: "login_system",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL Database.");
});

// Handle Login Request
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).send("Server error");
        }
        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send("Error while checking password");
            }
            if (!isMatch) {
                return res.status(401).send("Invalid password");
            }

            res.send("Login successful!");
        });
    });
});

// Handle Signup Request
app.post("/signup", (req, res) => {
    const { email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send("Error encrypting password");
        }

        const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send("Error creating user");
            }
            res.send("User registered successfully!");
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

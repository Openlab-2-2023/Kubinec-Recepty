// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// User registration endpoint
app.post('/register', (req, res) => {
    const { name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (name, password) VALUES (?, ?)", [name, hashedPassword], function(err) {
        if (err) {
            return res.status(500).send("Error creating user");
        }
        res.status(201).send("User created with ID: " + this.lastID);
    });
});

// User login endpoint
app.post('/login', (req, res) => {
    const { name, password } = req.body;

    db.get("SELECT * FROM users WHERE name = ?", [name], (err, user) => {
        if (err || !user) {
            return res.status(400).send("User not found");
        }
        if (bcrypt.compareSync(password, user.password)) {
            res.send("Login successful");
        } else {
            res.status(400).send("Invalid password");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

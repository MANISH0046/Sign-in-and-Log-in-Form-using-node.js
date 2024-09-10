const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Read users from JSON file
const getUsers = () => {
    const data = fs.readFileSync('users.json');
    return JSON.parse(data);
};

// Write users to JSON file
const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Sign Up route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    // Check if user already exists
    const userExists = users.find(user => user.username === username);

    if (userExists) {
        res.send('User already exists!');
    } else {
        users.push({ username, password });
        saveUsers(users);
        res.send('Sign up successful!');
    }
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();

    // Find user
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.send('Login successful!');
    } else {
        res.send('Invalid username or password!');
    }
});

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

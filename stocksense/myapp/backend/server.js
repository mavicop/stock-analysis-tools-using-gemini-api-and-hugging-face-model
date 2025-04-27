const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5001
; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory "database" for users
const users = [];

// Register endpoint
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Save user (in-memory)
  const newUser = { username, email, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Simulate authentication success
  res.status(200).json({ message: 'Login successful', user: { username: user.username, email: user.email } });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
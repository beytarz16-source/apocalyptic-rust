const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'apocalyptic-rust-secret-key-change-in-production';

// Initialize users file if it doesn't exist
async function initUsersFile() {
  try {
    // Check if data directory exists
    const dataDir = path.dirname(USERS_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      // Create data directory if it doesn't exist
      await fs.mkdir(dataDir, { recursive: true });
      console.log('Created data directory:', dataDir);
    }

    // Check if users file exists
    try {
      await fs.access(USERS_FILE);
    } catch {
      // Create users file if it doesn't exist
      await fs.writeFile(USERS_FILE, JSON.stringify([]), 'utf8');
      console.log('Created users file:', USERS_FILE);
    }
  } catch (error) {
    console.error('Error initializing users file:', error);
    throw error;
  }
}

// Register
router.post('/register', async (req, res) => {
  try {
    await initUsersFile();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if users file exists and is readable
    let users = [];
    try {
      const fileContent = await fs.readFile(USERS_FILE, 'utf8');
      users = fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (readError) {
      console.log('Users file does not exist or is empty, creating new one');
      users = [];
    }
    
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');

    const token = jwt.sign({ userId: newUser.id, username: newUser.username }, JWT_SECRET);
    res.json({ token, username: newUser.username });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    await initUsersFile();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Check if users file exists and is readable
    let users = [];
    try {
      const fileContent = await fs.readFile(USERS_FILE, 'utf8');
      users = fileContent.trim() ? JSON.parse(fileContent) : [];
    } catch (readError) {
      console.log('Users file does not exist or is empty');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());

// Database connection
let dbPool;

async function initializeDb() {
  dbPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'admin123',
    database: 'reservations',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  console.log('Database connection pool initialized');
}

// Authentication endpoints
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // In a real application, you would hash the password and compare with stored hash
    const [users] = await dbPool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Mock JWT token
    const token = 'mock-jwt-token-' + Date.now();
    
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: users[0].user_id,
          email: users[0].email,
          name: users[0].name,
          role: users[0].role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'CUSTOMER' } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password and name are required' 
      });
    }
    
    // Check if user already exists
    const [existingUsers] = await dbPool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Insert new user
    const userId = uuidv4();
    await dbPool.execute(
      'INSERT INTO users (user_id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [userId, email, password, name, role]
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: userId,
          email,
          name,
          role
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Start server
initializeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Test API server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`- POST /auth/login`);
    console.log(`- POST /auth/register`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
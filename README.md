# Bushiangala Technica Training Institute Website

**BUSTTI** website will be the first ever to change student-administration interaction and reduce the backlog on the administration. Additionally it will have a student portal for ease of access to basic services by the students. This will also ease administration communication to the students

## Installation

```bash
<https://github.com/nerr-0/bustti>
```

## Install dependancies

``` bash
npm install

# Bushiangala Technica Training Institute Website

**BUSTTI** website will be the first ever to change student-administration interaction and reduce the backlog on the administration. Additionally it will have a student portal for ease of access to basic services by the students. This will also ease administration communication to the students

## Installation

```bash
<https://github.com/nerr-0/bustti>
```

## Install dependancies

``` bash
npm install



Extra code.


Here is a version of the school portal backend using MySQL as the database instead of MongoDB. This example also includes user validation and improved error handling.

### 1. Setup the Project

First, ensure you have MySQL installed and running. Then, install the required Node.js dependencies:

```bash
mkdir school-portal
cd school-portal
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken body-parser dotenv
```

### 2. Create the Folder Structure

```bash
school-portal/
│
├── .env
├── server.js
├── models/
│   ├── db.js
│   ├── User.js
│   ├── Fee.js
│   ├── Event.js
│   └── Result.js
├── routes/
│   ├── auth.js
│   ├── fee.js
│   ├── event.js
│   └── result.js
└── middleware/
    └── auth.js
```

### 3. Configure the `.env` file

In your `.env` file, add the following variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_portal
JWT_SECRET=your_jwt_secret
```

### 4. Create Models

#### `models/db.js`

Create a MySQL database connection pool.

```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
```

#### `models/User.js`

```javascript
const db = require('./db');
const bcrypt = require('bcryptjs');

class User {
    static async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        return result.insertId;
    }

    static async findByUsername(username) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async validatePassword(enteredPassword, storedPassword) {
        return await bcrypt.compare(enteredPassword, storedPassword);
    }
}

module.exports = User;
```

#### `models/Fee.js`

```javascript
const db = require('./db');

class Fee {
    static async findByStudentId(studentId) {
        const [rows] = await db.execute(
            'SELECT * FROM fees WHERE student_id = ?',
            [studentId]
        );
        return rows[0];
    }
}

module.exports = Fee;
```

#### `models/Event.js`

```javascript
const db = require('./db');

class Event {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM events ORDER BY date DESC');
        return rows;
    }
}

module.exports = Event;
```

#### `models/Result.js`

```javascript
const db = require('./db');

class Result {
    static async findByStudentId(studentId) {
        const [rows] = await db.execute(
            'SELECT * FROM results WHERE student_id = ?',
            [studentId]
        );
        return rows;
    }
}

module.exports = Result;
```

### 5. Create Middleware

#### `middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = auth;
```

### 6. Create Routes

#### `routes/auth.js`

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register new student
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const userId = await User.create(username, password);
        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login student
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findByUsername(username);
        if (!user || !(await User.validatePassword(password, user.password))) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
```

#### `routes/fee.js`

```javascript
const express = require('express');
const auth = require('../middleware/auth');
const Fee = require('../models/Fee');

const router = express.Router();

// Get fee balance for logged-in student
router.get('/balance', auth, async (req, res) => {
    try {
        const fee = await Fee.findByStudentId(req.user.id);
        if (!fee) {
            return res.status(404).json({ error: 'Fee balance not found' });
        }
        res.json(fee);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
```

#### `routes/event.js`

```javascript
const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
```

#### `routes/result.js`

```javascript
const express = require('express');
const auth = require('../middleware/auth');
const Result = require('../models/Result');

const router = express.Router();

// Get exam results for logged-in student
router.get('/my-results', auth, async (req, res) => {
    try {
        const results = await Result.findByStudentId(req.user.id);
        if (!results.length) {
            return res.status(404).json({ error: 'Results not found' });
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
```

### 7. Setup the Server

#### `server.js`

```javascript
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const feeRoutes = require('./routes/fee');
const eventRoutes = require('./routes/event');
const resultRoutes = require('./routes/result');

const app = express();

app.use(bodyParser.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/results', resultRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 8. Running the Server

Before running the server, ensure your MySQL database is set up and the required tables (`users`, `fees`, `events`, `results`) are created:

```sql
CREATE DATABASE school_portal;

USE school_portal;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student'
);

CREATE TABLE fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL

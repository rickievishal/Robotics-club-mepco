# Backend Architecture Documentation

## Overview

The Robotics Club backend is built with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **Socket.IO** for real-time communication. It follows a RESTful API architecture with JWT authentication.

---

## 📁 Project Structure

```
robotics-club-backend/
├── index.js                    # Main server entry point
├── package.json                # Dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
│
├── controllers/                # Business logic
│   ├── authController.js       # Authentication logic
│   └── eventController.js      # Event management logic
│
├── middleware/                 # Express middleware
│   └── auth.js                 # JWT authentication & authorization
│
├── models/                     # Mongoose schemas
│   ├── dbConnection.js         # MongoDB connection
│   ├── userModel.js            # User schema
│   └── eventModel.js           # Event schema
│
├── routes/                     # API routes
│   ├── authRouter.js           # Auth endpoints
│   ├── chatRouter.js           # Chat endpoints
│   └── eventsRouter.js         # Event endpoints
│
└── utils/                      # Utility functions
    ├── googleConfig.js         # Google OAuth config
    └── passwordUtils.js        # Password hashing utilities
```

---

## 🗄️ Database Schema

### User Model (`models/userModel.js`)
```javascript
const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    image: { type: String },
    role: { 
        type: String, 
        default: 'member',
        enum: ['member', 'officebearer', 'admin']
    },
    password: { type: String },              // For email auth
    authProvider: { type: String, default: 'email' }, // 'email' or 'google'
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    chatroomJoined: { type: Boolean, default: false }
});
```

### Event Model (`models/eventModel.js`)
```javascript
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    venue: { type: String },
    maxParticipants: { type: Number },
    eventType: { 
        type: String, 
        enum: ['workshop', 'meeting', 'competition', 'seminar', 'social']
    },
    image: { type: String },                 // Base64 encoded image
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'social-logins' },
    createdAt: { type: Date, default: Date.now }
});
```

---

## 🌐 API Endpoints

### Authentication Routes (`routes/authRouter.js`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login with credentials | No |
| POST | `/auth/google` | Login with Google | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update profile | Yes |

### Event Routes (`routes/eventsRouter.js`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/events` | List all events | Yes | All |
| GET | `/events/:id` | Get event by ID | Yes | All |
| POST | `/events` | Create event | Yes | Admin, Officebearer |
| PUT | `/events/:id` | Update event | Yes | Admin, Officebearer |
| DELETE | `/events/:id` | Delete event | Yes | Admin |

### Chat Routes (`routes/chatRouter.js`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/messages` | Get message history | Yes |
| POST | `/messages` | Send message | Yes |

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Authentication Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Login                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  POST /auth/login                                    │   │
│  │  { email, password }                                 │   │
│  │              │                                       │   │
│  │              ▼                                       │   │
│  │  ┌─────────────────┐                                 │   │
│  │  │ Validate creds  │                                 │   │
│  │  │ Hash password   │                                 │   │
│  │  └────────┬────────┘                                 │   │
│  │           │                                          │   │
│  │           ▼                                          │   │
│  │  ┌─────────────────┐                                 │   │
│  │  │ Generate JWT    │                                 │   │
│  │  │ { _id, email }  │                                 │   │
│  │  └────────┬────────┘                                 │   │
│  │           │                                          │   │
│  │           ▼                                          │   │
│  │  { token, user: { _id, name, email, role } }         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  2. Subsequent Requests                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  GET /events                                         │   │
│  │  Headers: { Authorization: "Bearer <token>" }        │   │
│  │              │                                       │   │
│  │              ▼                                       │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │           auth Middleware                     │   │   │
│  │  │  ┌─────────────────────────────────────────┐  │   │   │
│  │  │  │ 1. Extract token from header            │  │   │   │
│  │  │  │ 2. Verify JWT with JWT_SECRET           │  │   │   │
│  │  │  │ 3. Fetch user from database             │  │   │   │
│  │  │  │ 4. Attach user to request object        │  │   │   │
│  │  │  └─────────────────────────────────────────┘  │   │   │
│  │  │              │                                 │   │   │
│  │  │           Error ──► 401/403 Response          │   │   │
│  │  │              │                                 │   │   │
│  │  │              ▼                                 │   │   │
│  │  │  Route Handler executes with req.user         │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 JWT Authentication Middleware (`middleware/auth.js`)

### authenticateToken
```javascript
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
```

### requireRole
```javascript
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
};
```

**Usage:**
```javascript
router.post('/', authenticateToken, requireRole(['admin', 'officebearer']), createEvent);
```

---

## 🔌 Real-Time Communication (Socket.IO)

### Server Setup (`index.js`)
```javascript
const socketIo = require('socket.io');
const io = socketIo(server, { 
    cors: { 
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// Socket event handlers
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-chat', (userData) => {
        // Handle user joining chat
    });
    
    socket.on('send-message', (messageData) => {
        // Broadcast message to all users
    });
    
    socket.on('disconnect', () => {
        // Handle user disconnect
    });
});
```

### Client Connection
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
    transports: ['websocket', 'polling']
});

// Events
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('new-message', (message) => {
    // Handle new message
});
```

### Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-chat` | Client → Server | User joins chatroom |
| `send-message` | Client → Server | User sends message |
| `new-message` | Server → Client | Broadcast new message |
| `user-joined` | Server → Client | Notify user joined |
| `user-left` | Server → Client | Notify user left |
| `online-users-update` | Server → Client | Updated user list |

---

## ⚙️ Server Configuration (`index.js`)

### Main Server Setup
```javascript
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
require('./models/dbConnection');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/events', eventsRouter);

// Socket.IO
const io = socketIo(server, {
    cors: { origin: '*' },
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
    // Handle connections
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

## 📊 Request/Response Flow

```
┌─────────────────────────────────────────────────────────────┐
│               Request/Response Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Client                                                    │
│    │                                                       │
│    ▼                                                       │
│  fetch('http://localhost:8080/events', {                   │
│    method: 'POST',                                         │
│    headers: {                                              │
│      'Authorization': 'Bearer <token>',                    │
│      'Content-Type': 'application/json'                    │
│    },                                                      │
│    body: JSON.stringify(eventData)                         │
│  })                                                        │
│    │                                                       │
│    ├──────────────────────────────────────►                │
│    │                                       │               │
│    │                                       ▼               │
│    │  Express Server (index.js)                           │
│    │         │                                              │
│    │         ▼                                              │
│    │  CORS Middleware                                      │
│    │         │                                              │
│    │         ▼                                              │
│    │  JSON Parser (express.json())                         │
│    │         │                                              │
│    │         ▼                                              │
│    │  Route: /events (eventsRouter.js)                     │
│    │         │                                              │
│    │         ▼                                              │
│    │  Auth Middleware (authenticateToken)                  │
│    │         │                                              │
│    │    ┌────┴────┐                                        │
│    │    │ Success │                                        │
│    │    └────┬────┘                                        │
│    │         │                                              │
│    │         ▼                                              │
│    │  Controller (eventController.js)                      │
│    │         │                                              │
│    │         ▼                                              │
│    │  MongoDB (mongoose)                                   │
│    │         │                                              │
│    │         ▼                                              │
│    │  Response: { success: true, event: {...} }            │
│    │         │                                              │
│    │    ┌────┴────┐                                        │
│    │    │  Error  │                                        │
│    │    └────┬────┘                                        │
│    │         │                                              │
│    │         ▼                                              │
│    │  Error Handler                                        │
│    │         │                                              │
│    └─────────┼─────────────────────────────────────────────│
│              │                                              │
│              ▼                                              │
│  Client receives response                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Creating a New API Endpoint

### Step 1: Create Controller
```javascript
// controllers/featureController.js
const FeatureModel = require('../models/featureModel');

const getFeatures = async (req, res) => {
    try {
        const features = await FeatureModel.find();
        res.json({ features });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createFeature = async (req, res) => {
    try {
        const feature = new FeatureModel(req.body);
        await feature.save();
        res.status(201).json({ feature });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getFeatures, createFeature };
```

### Step 2: Create Route File
```javascript
// routes/featureRouter.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getFeatures, createFeature } = require('../controllers/featureController');

// GET all features - authenticated users
router.get('/', authenticateToken, getFeatures);

// POST new feature - admin only
router.post('/', authenticateToken, requireRole(['admin']), createFeature);

module.exports = router;
```

### Step 3: Register Route
```javascript
// index.js
const featureRouter = require('./routes/featureRouter');
app.use('/features', featureRouter);
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
# Server
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/robotics-club

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 📦 Dependencies

### Production Dependencies
```json
{
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "socket.io": "^4.7.2",
    "dotenv": "^16.3.1",
    "google-auth-library": "^9.4.0"
}
```

### Development Dependencies
```json
{
    "nodemon": "^3.0.2"
}
```

---

## 🧪 API Testing Endpoints

### Using curl
```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get events (with token)
curl http://localhost:8080/events \
  -H "Authorization: Bearer <your-token>"
```

---

## 📈 Performance Considerations

1. **Connection Pooling** - Mongoose handles this automatically
2. **Indexing** - Add indexes to frequently queried fields
3. **Pagination** - Implement pagination for list endpoints
4. **Caching** - Consider Redis for session/data caching
5. **Compression** - Add response compression middleware

---

## 🔒 Security Best Practices

1. Use environment variables for secrets
2. Validate all user inputs
3. Implement rate limiting
4. Use HTTPS in production
5. Sanitize outputs to prevent XSS
6. Use parameterized queries (Mongoose does this)
7. Implement proper error handling
8. Log security-relevant events


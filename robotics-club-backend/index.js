// Production logging utility
const log = {
    info: (component, message) => console.log(`[INFO] [${component}] ${message}`),
    warn: (component, message) => console.warn(`[WARN] [${component}] ${message}`),
    error: (component, message) => console.error(`[ERROR] [${component}] ${message}`),
    request: (method, path, userId) => console.log(`[REQUEST] [${method}] ${path} - User: ${userId || 'anonymous'}`)
};

const express = require("express")
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors")
const path = require("path")
require("dotenv").config()
require("./models/dbConnection")
const authRouter = require("./routes/authRouter")
const chatRouter = require("./routes/chatRouter")
const eventsRouter = require("./routes/eventsRouter")
const UserModel = require("./models/userModel")

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with proper settings
const io = socketIo(server, { 
    cors: { 
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    allowEIO4: true,
    serveClient: false,
    pingTimeout: 60000,
    pingInterval: 25000
});

// Serve Socket.IO client files manually
app.use('/socket.io', (req, res) => {
    const filePath = path.join(__dirname, 'node_modules/socket.io/client-dist', req.url);
    res.sendFile(filePath, (err) => {
        if (err) {
            log.error('SOCKET', 'Failed to serve Socket.IO client');
            res.status(404).send('Socket.IO client not found');
        }
    });
});

const PORT = process.env.PORT || 8080

// Configure middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    log.request(req.method, req.path, req.user?._id);
    next();
});

app.get('/', (req,res)=> {
    res.send("Robotics Club API is running");
});

// API routes
app.use("/auth",authRouter)
app.use("/chat",chatRouter)
app.use("/events",eventsRouter)

// Chat room data storage
let messages = [];
let activeUsers = new Map();

app.set('io', io);

// Helper function to update user online status in database
async function updateUserOnlineStatus(userId, isOnline, inChatroom = false) {
  try {
    await UserModel.findByIdAndUpdate(userId, {
      isOnline: isOnline,
      lastSeen: new Date(),
      chatroomJoined: inChatroom
    });
  } catch (error) {
    log.error('DB', 'Failed to update user online status');
  }
}

// Helper function to get online users
async function getOnlineUsers() {
  try {
    const onlineUsers = await UserModel.find({ isOnline: true }).select('name email role isOnline lastSeen chatroomJoined');
    return onlineUsers;
  } catch (error) {
    log.error('DB', 'Failed to fetch online users');
    return [];
  }
}

// Enhanced socket connection handling
io.on('connection', (socket) => {
  log.info('SOCKET', `New connection: ${socket.id}`);
  
  // Connection error handling
  socket.on('error', (error) => {
    log.error('SOCKET', `Socket error for ${socket.id}`);
    socket.emit('error-message', { message: 'Connection error occurred' });
  });
  
// Handle user joining chatroom
  socket.on('join-chat', async (userData) => {
    try {
      await updateUserOnlineStatus(userData._id, true, true);
      
      activeUsers.set(socket.id, {
        ...userData,
        socketId: socket.id,
        joinedAt: new Date(),
        isOnline: true,
        inChatroom: true
      });
      
      socket.join('chatroom');
      
      socket.emit('active-users', Array.from(activeUsers.values()));
      
      const onlineUsers = await getOnlineUsers();
      io.emit('online-users-update', onlineUsers);
      
      socket.to('chatroom').emit('user-joined', {
        user: { name: userData.name, role: userData.role },
        timestamp: new Date()
      });
      
      socket.emit('init', messages);
      
      log.info('CHAT', `User joined: ${userData.name} (${userData.role})`);
    } catch (error) {
      log.error('CHAT', 'Failed to process user join');
    }
  });
  
  // Handle new messages
  socket.on('send-message', (messageData) => {
    const userData = activeUsers.get(socket.id);
    if (!userData) return;
    
    const message = {
      id: Date.now(),
      text: messageData.text,
      user: userData.name,
      userId: userData._id,
      timestamp: new Date(),
      socketId: socket.id
    };
    
    messages.push(message);
    
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    io.to('chatroom').emit('new-message', message);
    
    log.info('CHAT', `Message from ${userData.name}`);
  });
  
  // Handle user typing
  socket.on('user-typing', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      socket.to('chatroom').emit('user-typing', {
        userName: userData.name,
        timestamp: new Date()
      });
    }
  });
  
  // Handle user stop typing
  socket.on('user-stop-typing', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      socket.to('chatroom').emit('user-stop-typing', {
        userName: userData.name,
        timestamp: new Date()
      });
    }
  });
  
// Handle disconnect
  socket.on('disconnect', async () => {
    try {
      const userData = activeUsers.get(socket.id);
      if (userData) {
        log.info('SOCKET', `User disconnected: ${userData.name}`);
        
        await updateUserOnlineStatus(userData._id, false, false);
        
        activeUsers.delete(socket.id);
        
        socket.to('chatroom').emit('user-left', {
          user: { name: userData.name, role: userData.role },
          timestamp: new Date()
        });
        
        socket.to('chatroom').emit('active-users', Array.from(activeUsers.values()));
        
        const onlineUsers = await getOnlineUsers();
        io.emit('online-users-update', onlineUsers);
      } else {
        log.info('SOCKET', `Socket disconnected: ${socket.id}`);
      }
    } catch (error) {
      log.error('SOCKET', 'Error in disconnect handler');
    }
  });
  
// Handle user explicitly leaving chatroom
  socket.on('leave-chat', async () => {
    try {
      const userData = activeUsers.get(socket.id);
      if (userData) {
        await updateUserOnlineStatus(userData._id, false, false);
        
        activeUsers.delete(socket.id);
        
        socket.to('chatroom').emit('user-left', {
          user: { name: userData.name, role: userData.role },
          timestamp: new Date()
        });
        
        socket.to('chatroom').emit('active-users', Array.from(activeUsers.values()));
        
        const onlineUsers = await getOnlineUsers();
        io.emit('online-users-update', onlineUsers);
        
        socket.leave('chatroom');
        
        log.info('CHAT', `User left: ${userData.name}`);
      }
    } catch (error) {
      log.error('CHAT', 'Error in leave-chat handler');
    }
  });
});

// Start the HTTP server properly with Socket.IO integration
server.listen(PORT, () => {
    log.info('SERVER', `Server started on port ${PORT}`);
    log.info('SERVER', `Socket.IO ready at http://localhost:${PORT}`);
});

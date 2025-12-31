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
    serveClient: false,  // We'll serve client files manually
    pingTimeout: 60000,
    pingInterval: 25000
});

// Serve Socket.IO client files manually
app.use('/socket.io', (req, res) => {
    const filePath = path.join(__dirname, 'node_modules/socket.io/client-dist', req.url);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving Socket.IO client:', err);
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
app.get('/', (req,res)=> {
    res.send("hello");
});

// API routes
app.use("/auth",authRouter)
app.use("/chat",chatRouter)
app.use("/events",eventsRouter)

// Chat room data storage
let messages = [];
let activeUsers = new Map(); // Store active users with their socket IDs

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
    console.error('Error updating user online status:', error);
  }
}

// Helper function to get online users
async function getOnlineUsers() {
  try {
    const onlineUsers = await UserModel.find({ isOnline: true }).select('name email role isOnline lastSeen chatroomJoined');
    return onlineUsers;
  } catch (error) {
    console.error('Error fetching online users:', error);
    return [];
  }
}

// Enhanced socket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Connection error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    socket.emit('error-message', { message: 'Connection error occurred' });
  });
  
// Handle user joining chatroom
  socket.on('join-chat', async (userData) => {
    try {
      // Update user online status in database
      await updateUserOnlineStatus(userData._id, true, true);
      
      // Store user data with socket ID
      activeUsers.set(socket.id, {
        ...userData,
        socketId: socket.id,
        joinedAt: new Date(),
        isOnline: true,
        inChatroom: true
      });
      
      // Add user to a specific chatroom
      socket.join('chatroom');
      
      // Send current active users to the joining user
      socket.emit('active-users', Array.from(activeUsers.values()));
      
      // Get and send updated online users list
      const onlineUsers = await getOnlineUsers();
      io.emit('online-users-update', onlineUsers);
      
      // Broadcast to all users that someone joined
      socket.to('chatroom').emit('user-joined', {
        user: userData,
        timestamp: new Date()
      });
      
      // Send existing messages to new user
      socket.emit('init', messages);
      
      console.log(`${userData.name} joined the chat`);
    } catch (error) {
      console.error('Error in join-chat handler:', error);
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
    
    // Store message
    messages.push(message);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    // Broadcast message to all users in chatroom
    io.to('chatroom').emit('new-message', message);
    
    console.log(`${userData.name}: ${messageData.text}`);
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
        console.log(`${userData.name} disconnected`);
        
        // Update user offline status in database
        await updateUserOnlineStatus(userData._id, false, false);
        
        // Remove from active users
        activeUsers.delete(socket.id);
        
        // Broadcast to all users that someone left
        socket.to('chatroom').emit('user-left', {
          user: userData,
          timestamp: new Date()
        });
        
        // Update active users list for remaining users
        socket.to('chatroom').emit('active-users', Array.from(activeUsers.values()));
        
        // Get and send updated online users list
        const onlineUsers = await getOnlineUsers();
        io.emit('online-users-update', onlineUsers);
      } else {
        console.log('User disconnected:', socket.id);
      }
    } catch (error) {
      console.error('Error in disconnect handler:', error);
    }
  });
  
// Handle user explicitly leaving chatroom (optional event)
  socket.on('leave-chat', async () => {
    try {
      const userData = activeUsers.get(socket.id);
      if (userData) {
        // Update user status to offline but not necessarily in chatroom
        await updateUserOnlineStatus(userData._id, false, false);
        
        // Remove from active users
        activeUsers.delete(socket.id);
        
        // Broadcast to all users that someone left
        socket.to('chatroom').emit('user-left', {
          user: userData,
          timestamp: new Date()
        });
        
        // Update active users list for remaining users
        socket.to('chatroom').emit('active-users', Array.from(activeUsers.values()));
        
        // Get and send updated online users list
        const onlineUsers = await getOnlineUsers();
        io.emit('online-users-update', onlineUsers);
        
        // Leave the chatroom
        socket.leave('chatroom');
      }
    } catch (error) {
      console.error('Error in leave-chat handler:', error);
    }
  });
});

// Start the HTTP server properly with Socket.IO integration
server.listen(PORT, () => {
    console.log(`the server is running in the port ${PORT}`);
    console.log(`Socket.IO server is ready at http://localhost:${PORT}`);
});

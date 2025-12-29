const express = require("express")
const app = express()
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors")
require("dotenv").config()
require("./models/dbConnection")
const authRouter = require("./routes/authRouter")
const chatRouter = require("./routes/chatRouter")
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
app.use(express.json());
const PORT = process.env.PORT || 8080
app.use(cors())
app.get('/', (req,res)=> {
    res.send("hello");
})
app.use("/auth",authRouter)
app.use("/chat",chatRouter)

app.set('io', io);
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  // Optional: send existing messages to new client
  socket.emit('init', messages);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.listen(8080,()=>{
    console.log(`the server is running in the port ${PORT}`)
})
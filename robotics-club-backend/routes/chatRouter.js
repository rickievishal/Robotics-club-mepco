const express = require('express');
const router = express.Router();

// In-memory array to store messages
const messages = [];

// POST / - receive new message via HTTP and notify all connected clients
router.post('/', (req, res) => {
  const { user, text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text required.' });

  const msg = { user: user || 'Anonymous', text, timestamp: Date.now() };
  messages.push(msg);

  // Notify Socket.IO clients (io is attached to req.app)
  req.app.get('io').emit('message', msg);

  res.status(201).json(msg);
});

// GET / - get all messages
router.get('/', (req, res) => {
  res.json(messages);
});

module.exports = router;
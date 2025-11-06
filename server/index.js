const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const { GameServer } = require('./game/gameServer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Auth routes
app.use('/api/auth', authRoutes);

// Game server instance
const gameServer = new GameServer(io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  socket.on('player:join', (data) => {
    gameServer.addPlayer(socket.id, data, socket);
  });

  socket.on('player:move', (data) => {
    gameServer.updatePlayerPosition(socket.id, data, socket);
  });

  socket.on('player:shoot', (data) => {
    gameServer.handleShoot(socket.id, data);
  });

  socket.on('player:loot', (data) => {
    gameServer.handleLoot(socket.id, data);
  });

  socket.on('player:inventory', (data) => {
    gameServer.updateInventory(socket.id, data);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    gameServer.removePlayer(socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'NOT SET - This will cause errors!'}`);
});


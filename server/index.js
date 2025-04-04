const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const setupAgarGame = require('./games/agar');

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));
app.use(express.json());

// Routes
const userRoutes = require('./routes/users.js');
const gameRoutes = require('./routes/games.js');
const scoreRoutes = require('./routes/scores.js');

app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/scores', scoreRoutes);

// Socket.IO kurulumu
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Agar.io oyunu için socket kurulumu
setupAgarGame(httpServer);

// Socket.IO olayları
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  socket.on('joinGame', (gameId) => {
    socket.join(gameId);
    io.to(gameId).emit('playerJoined', { playerId: socket.id });
  });

  socket.on('gameAction', (data) => {
    io.to(data.gameId).emit('gameUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

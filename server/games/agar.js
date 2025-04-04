const { Server } = require('socket.io');

function setupAgarGame(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  const players = new Map();

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Yeni oyuncu bilgisini diğer oyunculara gönder
    socket.broadcast.emit('playerJoined', {
      playerId: socket.id,
      x: Math.random() * 1900 + 100,
      y: Math.random() * 1900 + 100,
      scale: 1
    });

    // Mevcut oyuncuları yeni oyuncuya gönder
    players.forEach((player, id) => {
      if (id !== socket.id) {
        socket.emit('playerJoined', {
          playerId: id,
          ...player
        });
      }
    });

    // Oyuncu hareketi
    socket.on('playerMoved', (playerInfo) => {
      players.set(socket.id, playerInfo);
      socket.broadcast.emit('playerMoved', {
        playerId: socket.id,
        ...playerInfo
      });
    });

    // Oyuncu ayrıldı
    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      players.delete(socket.id);
      io.emit('playerLeft', socket.id);
    });
  });
}

module.exports = setupAgarGame;

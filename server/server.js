const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Statik dosyaları serve et
app.use(express.static(path.join(__dirname, '../public')));

// Oyun durumu
const gameState = {
    players: {},
    collectibles: [],
    powerUps: [],
    leaderboard: []
};

// Socket.io bağlantı yönetimi
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');

    // Oyuncunun oyuna katılması
    socket.on('joinGame', (data) => {
        gameState.players[socket.id] = {
            id: socket.id,
            name: data.name,
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            score: 0,
            health: 100,
            shield: false,
            speed: 5,
            size: 20,
            gameMode: data.gameMode
        };

        io.emit('gameState', gameState);
        io.emit('playerJoined', gameState.players[socket.id]);
    });

    // Oyuncu hareketi
    socket.on('playerMove', (movement) => {
        const player = gameState.players[socket.id];
        if (player) {
            if (movement.x) player.x += movement.x;
            if (movement.y) player.y += movement.y;

            // Sınırları kontrol et
            player.x = Math.max(20, Math.min(780, player.x));
            player.y = Math.max(20, Math.min(580, player.y));

            io.emit('gameState', gameState);
        }
    });

    // Bağlantı koptuğunda
    socket.on('disconnect', () => {
        delete gameState.players[socket.id];
        io.emit('playerLeft', socket.id);
    });
});

// Yeni oyun mantığı ekle
setInterval(() => {
    // Oyun nesnelerini güncelle
    updateGameState();
    // Güncel durumu tüm oyunculara gönder
    io.emit('gameState', gameState);
}, 1000 / 60); // 60 FPS

function updateGameState() {
    // Ölen oyuncuları kontrol et
    Object.values(gameState.players).forEach(player => {
        if (player.health <= 0) {
            player.x = Math.random() * 700 + 50;
            player.y = Math.random() * 500 + 50;
            player.health = 100;
            player.score = Math.max(0, player.score - 50);
        }
    });
    
    // Liderlik tablosunu güncelle
    gameState.leaderboard = Object.values(gameState.players)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 
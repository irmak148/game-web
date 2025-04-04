let socket;
let canvas;
let ctx;
let playerName;
let players = {};
let myId;
let gameMode = 'survival'; // 'survival' veya 'collection'
let powerUps = [];
let collectibles = [];
let sounds = {};
let leaderboard = [];
let playerHealth = 100;

// Oyun başlatma
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Canvas boyutunu ayarla
    canvas.width = 800;
    canvas.height = 600;

    // Socket.io bağlantısı
    socket = io();

    // Socket olaylarını dinle
    setupSocketListeners();

    // Oyun döngüsünü başlat
    gameLoop();
}

// Socket olaylarını ayarla
function setupSocketListeners() {
    socket.on('connect', () => {
        myId = socket.id;
        console.log('Sunucuya bağlanıldı');
    });

    socket.on('gameState', (gameData) => {
        players = gameData.players;
        updatePlayersList();
    });

    socket.on('playerJoined', (player) => {
        console.log(`${player.name} oyuna katıldı`);
    });

    socket.on('playerLeft', (playerId) => {
        delete players[playerId];
        updatePlayersList();
    });
}

// Oyun döngüsü
function gameLoop() {
    // Ekranı temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    createCollectibles();
    createPowerUp();
    
    if (players[myId]) {
        checkCollisions(players[myId]);
    }
    
    drawGame();
    updateLeaderboard();
    
    // Bir sonraki frame'i planla
    requestAnimationFrame(gameLoop);
}

// Oyun çizimini güncelle
function drawGame() {
    // Arka plan
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Toplanabilir nesneleri çiz
    collectibles.forEach(collectible => {
        ctx.fillStyle = collectible.type === 'powerup' ? '#ff0' : '#fff';
        ctx.beginPath();
        ctx.arc(collectible.x, collectible.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Güç-üpleri çiz
    powerUps.forEach(powerUp => {
        ctx.fillStyle = {
            speed: '#0f0',
            shield: '#00f',
            size: '#f0f'
        }[powerUp.type];
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Oyuncuları çiz
    Object.values(players).forEach(player => {
        // Oyuncu gövdesi
        ctx.fillStyle = player.id === myId ? '#0f0' : '#f00';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size || 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Kalkan efekti
        if (player.shield) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(player.x, player.y, (player.size || 20) + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // İsim ve skor
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`${player.name} (${player.score})`, player.x, player.y - 30);
        
        // Can barı
        if (gameMode === 'survival') {
            const healthWidth = 40;
            const healthHeight = 4;
            ctx.fillStyle = '#f00';
            ctx.fillRect(player.x - healthWidth/2, player.y - 25, healthWidth, healthHeight);
            ctx.fillStyle = '#0f0';
            ctx.fillRect(player.x - healthWidth/2, player.y - 25, 
                        (player.health/100) * healthWidth, healthHeight);
        }
    });
}

// Oyuncu listesini güncelle
function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    Object.values(players).forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name}: ${player.score || 0}`;
        playersList.appendChild(li);
    });
}

// Oyuna başlama butonu için event listener
document.getElementById('startButton').addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    if (playerName.trim() !== '') {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        initGame();
        socket.emit('joinGame', { name: playerName });
    }
});

// Hareket kontrollerini ekle
document.addEventListener('keydown', (e) => {
    if (!socket) return;

    const movement = {
        ArrowUp: { y: -5 },
        ArrowDown: { y: 5 },
        ArrowLeft: { x: -5 },
        ArrowRight: { x: 5 }
    }[e.key];

    if (movement) {
        socket.emit('playerMove', movement);
    }
});

// Ses efektlerini yükle
function loadSounds() {
    sounds.collect = new Audio('sounds/collect.mp3');
    sounds.powerup = new Audio('sounds/powerup.mp3');
    sounds.hit = new Audio('sounds/hit.mp3');
    sounds.background = new Audio('sounds/background.mp3');
    sounds.background.loop = true;
}

// Oyun nesnelerini oluştur
function createCollectibles() {
    if (collectibles.length < 5) {
        collectibles.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            type: Math.random() < 0.3 ? 'powerup' : 'coin',
            collected: false
        });
    }
}

// Güç-üpleri oluştur
function createPowerUp() {
    if (Math.random() < 0.02 && powerUps.length < 2) {
        powerUps.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            type: ['speed', 'shield', 'size'][Math.floor(Math.random() * 3)],
            active: true
        });
    }
}

// Çarpışma kontrolü
function checkCollisions(player) {
    // Diğer oyuncularla çarpışma
    Object.values(players).forEach(otherPlayer => {
        if (otherPlayer.id !== player.id) {
            const dx = player.x - otherPlayer.x;
            const dy = player.y - otherPlayer.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 40) { // İki oyuncu çarpıştı
                handlePlayerCollision(player, otherPlayer);
            }
        }
    });

    // Güç-üplerle çarpışma
    powerUps.forEach((powerUp, index) => {
        if (powerUp.active) {
            const dx = player.x - powerUp.x;
            const dy = player.y - powerUp.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                applyPowerUp(player, powerUp);
                powerUps.splice(index, 1);
                sounds.powerup.play();
            }
        }
    });

    // Toplanabilir nesnelerle çarpışma
    collectibles.forEach((collectible, index) => {
        if (!collectible.collected) {
            const dx = player.x - collectible.x;
            const dy = player.y - collectible.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                collectItem(player, collectible);
                collectibles.splice(index, 1);
                sounds.collect.play();
            }
        }
    });
}

// Güç-üp efektlerini uygula
function applyPowerUp(player, powerUp) {
    switch (powerUp.type) {
        case 'speed':
            player.speed = 8; // Normal hız 5
            setTimeout(() => player.speed = 5, 5000);
            break;
        case 'shield':
            player.shield = true;
            setTimeout(() => player.shield = false, 8000);
            break;
        case 'size':
            player.size = 30; // Normal boyut 20
            setTimeout(() => player.size = 20, 6000);
            break;
    }
}

// Oyuncu çarpışmalarını işle
function handlePlayerCollision(player1, player2) {
    if (gameMode === 'survival') {
        if (!player1.shield) {
            player1.health -= 10;
            sounds.hit.play();
        }
        updateLeaderboard();
    }
}

// Liderlik tablosunu güncelle
function updateLeaderboard() {
    leaderboard = Object.values(players)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    
    const leaderboardEl = document.getElementById('leaderboard');
    leaderboardEl.innerHTML = '<h3>Liderlik Tablosu</h3>';
    leaderboard.forEach((player, index) => {
        leaderboardEl.innerHTML += `
            <div class="leaderboard-item">
                ${index + 1}. ${player.name}: ${player.score}
            </div>
        `;
    });
} 
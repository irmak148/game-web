import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../../components/GameLayout';

function AgarGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Game state
  const gameState = useRef({
    player: null,
    npcs: [],
    foods: [],
    lastTime: 0,
    gameLoop: null,
    canvas: null,
    ctx: null,
    mouseX: 0,
    mouseY: 0,
    camera: { x: 0, y: 0 },
    worldSize: { width: 4000, height: 4000 },
    playerDirection: { dx: 0, dy: 0 }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    gameState.current.canvas = canvas;
    gameState.current.ctx = ctx;
    
    function resizeCanvas() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    initGame();
    startGameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      stopGameLoop();
    };
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        handlePause();
      }
      if (e.code === 'Escape' && isPaused) {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, navigate]);

  // Handle pause state changes
  useEffect(() => {
    if (isPaused) {
      stopGameLoop();
    } else if (!gameOver) {
      startGameLoop();
    }
  }, [isPaused, gameOver]);

  function startGameLoop() {
    if (!gameState.current.gameLoop) {
      gameState.current.gameLoop = requestAnimationFrame(gameLoop);
    }
  }

  function stopGameLoop() {
    if (gameState.current.gameLoop) {
      cancelAnimationFrame(gameState.current.gameLoop);
      gameState.current.gameLoop = null;
    }
  }

  function handlePause() {
    setIsPaused(prev => !prev);
  }

  function gameLoop() {
    const state = gameState.current;
    
    // Update game state
    if (state.player) {
      // Update player position
      state.player.x += state.playerDirection.dx * state.player.speed;
      state.player.y += state.playerDirection.dy * state.player.speed;

      // Wrap around world boundaries
      state.player.x = (state.player.x + state.worldSize.width) % state.worldSize.width;
      state.player.y = (state.player.y + state.worldSize.height) % state.worldSize.height;

      // Update camera
      state.camera = {
        x: state.player.x - state.canvas.width / 2,
        y: state.player.y - state.canvas.height / 2
      };

      // Update NPCs
      state.npcs.forEach(npc => {
        npc.x += Math.cos(npc.direction) * npc.speed;
        npc.y += Math.sin(npc.direction) * npc.speed;
        npc.x = (npc.x + state.worldSize.width) % state.worldSize.width;
        npc.y = (npc.y + state.worldSize.height) % state.worldSize.height;
        
        if (Math.random() < 0.01) {
          npc.direction = Math.random() * Math.PI * 2;
        }
      });

      // Check collisions
      checkCollisions();
    }

    // Draw the current state
    drawGame();

    // Only request next frame if not paused
    if (!isPaused && !gameOver) {
      gameState.current.gameLoop = requestAnimationFrame(gameLoop);
    }
  }

  // Handle mouse movement
  useEffect(() => {
    function handleMouseMove(e) {
      const canvas = gameState.current.canvas;
      if (canvas && !isPaused && !gameOver) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        // Calculate direction to mouse
        const player = gameState.current.player;
        const dx = mouseX - canvas.width / 2;
        const dy = mouseY - canvas.height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          gameState.current.playerDirection = {
            dx: dx / distance,
            dy: dy / distance
          };
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPaused, gameOver]);

  function createNPCs(count) {
    const worldSize = gameState.current.worldSize;
    const npcs = [];
    
    // Create NPCs with varying sizes
    for (let i = 0; i < count; i++) {
      // Random size category
      const sizeCategory = Math.random();
      let radius, speed, color;

      if (sizeCategory < 0.5) { // 50% small
        radius = 15 + Math.random() * 10;
        speed = 1 + Math.random() * 0.5; // Reduced from 2 to 1-1.5
        color = '#ff4444';
      } else if (sizeCategory < 0.8) { // 30% medium
        radius = 30 + Math.random() * 20;
        speed = 0.8 + Math.random() * 0.4; // Reduced from 1.5 to 0.8-1.2
        color = '#ff8800';
      } else { // 20% large
        radius = 50 + Math.random() * 30;
        speed = 0.5 + Math.random() * 0.3; // Reduced from 1 to 0.5-0.8
        color = '#ff0000';
      }

      npcs.push({
        x: Math.random() * worldSize.width,
        y: Math.random() * worldSize.height,
        radius,
        speed,
        color,
        direction: Math.random() * Math.PI * 2
      });
    }
    return npcs;
  }

  function createFoods(count) {
    const worldSize = gameState.current.worldSize;
    const foods = [];
    
    // Create more food items with varied colors
    const foodColors = ['#2ecc71', '#27ae60', '#16a085', '#3498db', '#2980b9'];
    
    for (let i = 0; i < count; i++) {
      foods.push({
        x: Math.random() * worldSize.width,
        y: Math.random() * worldSize.height,
        radius: 5 + Math.random() * 3,
        color: foodColors[Math.floor(Math.random() * foodColors.length)]
      });
    }
    return foods;
  }

  function drawGame() {
    const canvas = gameState.current.canvas;
    const ctx = gameState.current.ctx;
    const camera = gameState.current.camera;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Function to handle wraparound drawing
    function drawWrappedObject(obj, drawFunc) {
      const screenX = obj.x - camera.x;
      const screenY = obj.y - camera.y;

      // Draw the main object
      drawFunc(screenX, screenY);

      // Draw wrapped copies if needed
      if (screenX < obj.radius) drawFunc(screenX + gameState.current.worldSize.width, screenY);
      if (screenX > canvas.width - obj.radius) drawFunc(screenX - gameState.current.worldSize.width, screenY);
      if (screenY < obj.radius) drawFunc(screenX, screenY + gameState.current.worldSize.height);
      if (screenY > canvas.height - obj.radius) drawFunc(screenX, screenY - gameState.current.worldSize.height);
    }

    // Draw foods
    gameState.current.foods.forEach(food => {
      drawWrappedObject(food, (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, food.radius, 0, Math.PI * 2);
        ctx.fillStyle = food.color;
        ctx.fill();
      });
    });

    // Draw NPCs
    gameState.current.npcs.forEach(npc => {
      drawWrappedObject(npc, (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, npc.radius, 0, Math.PI * 2);
        ctx.fillStyle = npc.color;
        ctx.fill();
      });
    });

    // Draw player
    const player = gameState.current.player;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
  }

  function checkCollisions() {
    const player = gameState.current.player;
    const npcs = gameState.current.npcs;
    const foods = gameState.current.foods;
    const worldSize = gameState.current.worldSize;

    // Check food collisions
    for (let i = foods.length - 1; i >= 0; i--) {
      const food = foods[i];
      const dx = player.x - food.x;
      const dy = player.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.radius + food.radius) {
        foods.splice(i, 1);
        player.radius += 0.5;
        setScore(prev => prev + 10);

        // Add new food when one is eaten
        foods.push({
          x: Math.random() * worldSize.width,
          y: Math.random() * worldSize.height,
          radius: 5 + Math.random() * 3,
          color: ['#2ecc71', '#27ae60', '#16a085', '#3498db', '#2980b9'][Math.floor(Math.random() * 5)]
        });
      }
    }

    // Check NPC collisions with wraparound
    npcs.forEach(npc => {
      const dx = Math.min(
        Math.abs(player.x - npc.x),
        Math.abs(player.x - npc.x + worldSize.width),
        Math.abs(player.x - npc.x - worldSize.width)
      );
      const dy = Math.min(
        Math.abs(player.y - npc.y),
        Math.abs(player.y - npc.y + worldSize.height),
        Math.abs(player.y - npc.y - worldSize.height)
      );
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.radius + npc.radius) {
        if (player.radius > npc.radius) {
          player.radius += npc.radius / 4;
          setScore(prev => prev + Math.floor(npc.radius * 5));
          
          // Respawn NPC at random location
          npc.x = Math.random() * worldSize.width;
          npc.y = Math.random() * worldSize.height;
          
          // Randomize new NPC size
          const sizeCategory = Math.random();
          if (sizeCategory < 0.5) {
            npc.radius = 15 + Math.random() * 10;
            npc.speed = 1 + Math.random() * 0.5;
          } else if (sizeCategory < 0.8) {
            npc.radius = 30 + Math.random() * 20;
            npc.speed = 0.8 + Math.random() * 0.4;
          } else {
            npc.radius = 50 + Math.random() * 30;
            npc.speed = 0.5 + Math.random() * 0.3;
          }
        } else {
          setGameOver(true);
        }
      }
    });

    // Replenish food
    if (foods.length < 30) {
      foods.push(...createFoods(20));
    }
  }

  function handleRestart() {
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    initGame();
    startGameLoop();
  }

  function initGame() {
    const worldSize = gameState.current.worldSize;
    
    gameState.current.player = {
      x: worldSize.width / 2,
      y: worldSize.height / 2,
      radius: 20,
      speed: 2
    };

    gameState.current.camera = {
      x: gameState.current.player.x - gameState.current.canvas.width / 2,
      y: gameState.current.player.y - gameState.current.canvas.height / 2
    };

    gameState.current.playerDirection = { dx: 0, dy: 0 };
    gameState.current.npcs = createNPCs(20);
    gameState.current.foods = createFoods(200); // Increased from 50 to 200 foods
  }

  return (
    <GameLayout
      isPaused={isPaused}
      onPause={handlePause}
      score={score}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'crosshair' }}
      />
      {(isPaused || gameOver) && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white text-4xl font-bold mb-8">
              {gameOver ? "Game Over" : "Paused"}
            </h2>
            <div className="space-x-4">
              <button
                onClick={gameOver ? handleRestart : () => setIsPaused(false)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {gameOver ? "Restart" : "Resume"}
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
}

export default AgarGame;

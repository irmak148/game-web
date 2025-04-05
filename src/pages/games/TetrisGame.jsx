import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import GameLayout from '../../components/GameLayout';
import Navbar from '../../components/Navbar';

function TetrisGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { addRecentGame, saveScore } = useGame();
  
  // Game state
  const gameState = useRef({
    board: Array(20).fill().map(() => Array(10).fill(0)),
    currentPiece: null,
    nextPiece: null,
    gameLoop: null,
    dropSpeed: 1000, // Initial drop speed in ms
    lastTime: 0,
    colors: [
      '#000000', // empty cell
      '#06b6d4', // I piece (cyan)
      '#fbbf24', // O piece (yellow)
      '#8b5cf6', // T piece (purple)
      '#f97316', // L piece (orange)
      '#ef4444', // Z piece (red)
      '#10b981', // S piece (green)
      '#3b82f6'  // J piece (blue)
    ],
    pieces: [
      // I piece
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      // O piece
      [
        [2, 2],
        [2, 2]
      ],
      // T piece
      [
        [0, 3, 0],
        [3, 3, 3],
        [0, 0, 0]
      ],
      // L piece
      [
        [0, 0, 4],
        [4, 4, 4],
        [0, 0, 0]
      ],
      // Z piece
      [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
      ],
      // S piece
      [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0]
      ],
      // J piece
      [
        [7, 0, 0],
        [7, 7, 7],
        [0, 0, 0]
      ]
    ]
  });

  useEffect(() => {
    if (location.pathname === '/games/tetris') {
      console.log('TetrisGame mounted at', location.pathname);
      addRecentGame('tetris');
      
      setTimeout(() => {
        if (canvasRef.current) {
          initGame();
          startGameLoop();
        }
      }, 100);
    }
    
    return () => {
      stopGameLoop();
    };
  }, [location.pathname, addRecentGame]);

  // Handle pause state changes
  useEffect(() => {
    if (isPaused) {
      stopGameLoop();
    } else if (!gameOver) {
      startGameLoop();
    }
  }, [isPaused, gameOver]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver || isPaused) return;
      
      switch (e.code) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case 'Space':
          dropPiece();
          break;
        case 'KeyP':
          handlePause();
          break;
        case 'Escape':
          if (isPaused) {
            navigate('/');
          } else {
            handlePause();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, gameOver, navigate]);

  function initGame() {
    const state = gameState.current;
    state.board = Array(20).fill().map(() => Array(10).fill(0));
    state.currentPiece = generatePiece();
    state.nextPiece = generatePiece();
    state.dropSpeed = 1000;
    state.lastTime = 0;
    
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    
    drawGame();
  }

  function generatePiece() {
    const state = gameState.current;
    const pieceType = Math.floor(Math.random() * state.pieces.length);
    const piece = state.pieces[pieceType];
    
    return {
      shape: JSON.parse(JSON.stringify(piece)),
      color: pieceType + 1,
      x: Math.floor((10 - piece[0].length) / 2),
      y: 0
    };
  }

  function startGameLoop() {
    if (!gameState.current.gameLoop) {
      gameState.current.lastTime = performance.now();
      gameState.current.gameLoop = requestAnimationFrame(gameLoop);
    }
  }

  function stopGameLoop() {
    if (gameState.current.gameLoop) {
      cancelAnimationFrame(gameState.current.gameLoop);
      gameState.current.gameLoop = null;
    }
  }

  function gameLoop(timestamp) {
    const state = gameState.current;
    const elapsed = timestamp - state.lastTime;
    
    if (elapsed > state.dropSpeed) {
      state.lastTime = timestamp;
      
      if (!movePiece(0, 1)) {
        // Piece has settled, place it on the board
        placePiece();
        
        // Clear completed lines
        const clearedLines = clearLines();
        
        // Update score
        if (clearedLines > 0) {
          updateScore(clearedLines);
        }
        
        // Generate new piece
        state.currentPiece = state.nextPiece;
        state.nextPiece = generatePiece();
        
        // Check for game over
        if (isCollision(state.currentPiece)) {
          setGameOver(true);
          saveScore('tetris', score);
          return;
        }
      }
      
      drawGame();
    }
    
    if (!isPaused && !gameOver) {
      state.gameLoop = requestAnimationFrame(gameLoop);
    }
  }

  function drawGame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = gameState.current;
    const cellSize = Math.min(canvas.width / 12, canvas.height / 22);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw board background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, cellSize * 10, cellSize * 20);
    
    // Draw grid
    ctx.strokeStyle = '#1e293b';
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
    
    // Draw board pieces
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        if (state.board[y][x] !== 0) {
          ctx.fillStyle = state.colors[state.board[y][x]];
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Draw border
          ctx.strokeStyle = '#f8fafc';
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Draw current piece
    if (state.currentPiece) {
      const { shape, color, x, y } = state.currentPiece;
      
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] !== 0) {
            ctx.fillStyle = state.colors[color];
            ctx.fillRect((x + j) * cellSize, (y + i) * cellSize, cellSize, cellSize);
            
            // Draw border
            ctx.strokeStyle = '#f8fafc';
            ctx.strokeRect((x + j) * cellSize, (y + i) * cellSize, cellSize, cellSize);
          }
        }
      }
    }
    
    // Draw next piece preview
    if (state.nextPiece) {
      const { shape, color } = state.nextPiece;
      const previewX = 10 * cellSize + 20;
      const previewY = 20;
      
      // Draw preview box
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(previewX, previewY, cellSize * 4 + 20, cellSize * 4 + 20);
      ctx.strokeStyle = '#f8fafc';
      ctx.strokeRect(previewX, previewY, cellSize * 4 + 20, cellSize * 4 + 20);
      
      // Draw preview title
      ctx.fillStyle = '#f8fafc';
      ctx.font = '16px Arial';
      ctx.fillText('Next', previewX + 10, previewY - 5);
      
      // Draw next piece
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] !== 0) {
            ctx.fillStyle = state.colors[color];
            ctx.fillRect(previewX + 10 + j * cellSize, previewY + 10 + i * cellSize, cellSize, cellSize);
            
            // Draw border
            ctx.strokeStyle = '#f8fafc';
            ctx.strokeRect(previewX + 10 + j * cellSize, previewY + 10 + i * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }

  function isCollision(piece) {
    const { shape, x, y } = piece;
    const board = gameState.current.board;
    
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] !== 0) {
          const boardX = x + j;
          const boardY = y + i;
          
          // Check boundaries
          if (boardX < 0 || boardX >= 10 || boardY >= 20) {
            return true;
          }
          
          // Check if position is already occupied (but ignore if it's above the board)
          if (boardY >= 0 && board[boardY][boardX] !== 0) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  function movePiece(deltaX, deltaY) {
    const state = gameState.current;
    const piece = state.currentPiece;
    
    if (!piece) return false;
    
    const newPiece = {
      ...piece,
      x: piece.x + deltaX,
      y: piece.y + deltaY
    };
    
    if (!isCollision(newPiece)) {
      state.currentPiece = newPiece;
      return true;
    }
    
    return false;
  }

  function rotatePiece() {
    const state = gameState.current;
    const piece = state.currentPiece;
    
    if (!piece) return;
    
    // Create a rotated version of the shape
    const rotatedShape = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      rotatedShape.push([]);
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        rotatedShape[i].push(piece.shape[j][i]);
      }
    }
    
    const newPiece = {
      ...piece,
      shape: rotatedShape
    };
    
    // Check if rotation is valid
    if (!isCollision(newPiece)) {
      state.currentPiece = newPiece;
    }
  }

  function dropPiece() {
    const state = gameState.current;
    
    while (movePiece(0, 1)) {
      // Keep moving down until collision
    }
  }

  function placePiece() {
    const state = gameState.current;
    const { shape, color, x, y } = state.currentPiece;
    
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] !== 0) {
          const boardY = y + i;
          const boardX = x + j;
          
          // Place piece on the board if it's within bounds
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            state.board[boardY][boardX] = color;
          }
        }
      }
    }
  }

  function clearLines() {
    const state = gameState.current;
    const board = state.board;
    let linesCleared = 0;
    
    for (let y = 19; y >= 0; y--) {
      const isLineComplete = board[y].every(cell => cell !== 0);
      
      if (isLineComplete) {
        // Clear the line
        for (let yy = y; yy > 0; yy--) {
          for (let x = 0; x < 10; x++) {
            board[yy][x] = board[yy - 1][x];
          }
        }
        
        // Clear the top line
        for (let x = 0; x < 10; x++) {
          board[0][x] = 0;
        }
        
        linesCleared++;
        y++; // Check the same line again (since we moved everything down)
      }
    }
    
    return linesCleared;
  }

  function updateScore(clearedLines) {
    const points = [0, 100, 300, 500, 800]; // Points for 0, 1, 2, 3, 4 lines cleared
    const newScore = score + points[clearedLines] * level;
    setScore(newScore);
    
    const newLines = lines + clearedLines;
    setLines(newLines);
    
    // Update level
    const newLevel = Math.floor(newLines / 10) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Increase drop speed with level
      gameState.current.dropSpeed = Math.max(100, 1000 - (newLevel - 1) * 100);
    }
    
    saveScore('tetris', newScore);
  }

  function handlePause() {
    setIsPaused(!isPaused);
  }

  function handleRestart() {
    setGameOver(false);
    setIsPaused(false);
    initGame();
    startGameLoop();
  }

  // Handle canvas resize
  useEffect(() => {
    function handleResize() {
      if (canvasRef.current) {
        // Set canvas size to fill container
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
          drawGame();
        }
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="flex-grow pt-14">
        <GameLayout
          isPaused={isPaused}
          onPause={handlePause}
          score={score}
        >
          <div className="h-full w-full flex justify-center items-center bg-gray-900">
            <canvas
              ref={canvasRef}
              className="max-h-full"
              style={{ 
                backgroundColor: '#0f172a',
                aspectRatio: '1/2',
                maxHeight: 'calc(100vh - 56px)',
                border: '4px solid white'
              }}
            />
          </div>
          
          {(isPaused || gameOver) && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-center p-8 rounded-lg border-4 border-white shadow-xl">
                <h2 className="text-white text-6xl font-bold mb-4">
                  {gameOver ? "Game Over" : "Paused"}
                </h2>
                {gameOver && <p className="text-white text-2xl mb-8">Your score: {score}</p>}
                <div className="space-x-4">
                  <button
                    onClick={gameOver ? handleRestart : () => setIsPaused(false)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    {gameOver ? "Play Again" : "Resume"}
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
      </div>
    </div>
  );
}

export default TetrisGame; 
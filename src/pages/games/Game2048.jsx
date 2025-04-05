import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import GameLayout from '../../components/GameLayout';
import Navbar from '../../components/Navbar';

function Game2048() {
  const navigate = useNavigate();
  const { addRecentGame, saveScore } = useGame();
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize game
  useEffect(() => {
    addRecentGame('2048');
    initGame();
  }, [addRecentGame]);

  function initGame() {
    const newGrid = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  }

  function addRandomTile(currentGrid) {
    const available = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          available.push({ x: i, y: j });
        }
      }
    }
    if (available.length > 0) {
      const randomCell = available[Math.floor(Math.random() * available.length)];
      currentGrid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Helper function to transpose the grid (for rotations)
  function transpose(grid) {
    const newGrid = Array(4).fill().map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newGrid[i][j] = grid[j][i];
      }
    }
    return newGrid;
  }

  // Helper function to reverse rows in the grid
  function reverseRows(grid) {
    return grid.map(row => [...row].reverse());
  }

  // Move left - base movement operation
  function moveLeft(currentGrid) {
    let moved = false;
    let newScore = score;
    const newGrid = [];

    for (let i = 0; i < 4; i++) {
      // Get non-zero tiles
      let row = currentGrid[i].filter(cell => cell !== 0);
      let resultRow = [];
      
      // Merge tiles
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const mergedValue = row[j] * 2;
          resultRow.push(mergedValue);
          newScore += mergedValue;
          j++; // Skip the next tile since we merged it
          moved = true;
        } else {
          resultRow.push(row[j]);
        }
      }
      
      // Fill with zeros
      while (resultRow.length < 4) {
        resultRow.push(0);
      }
      
      // Check if the row has changed
      if (JSON.stringify(currentGrid[i]) !== JSON.stringify(resultRow)) {
        moved = true;
      }
      
      newGrid.push(resultRow);
    }
    
    return { newGrid, moved, newScore };
  }

  // Move right
  function moveRight(currentGrid) {
    // Reverse, move left, then reverse back
    const reversed = reverseRows(currentGrid);
    const { newGrid, moved, newScore } = moveLeft(reversed);
    return { newGrid: reverseRows(newGrid), moved, newScore };
  }

  // Move up
  function moveUp(currentGrid) {
    // Transpose, move left, then transpose back
    const transposed = transpose(currentGrid);
    const { newGrid, moved, newScore } = moveLeft(transposed);
    return { newGrid: transpose(newGrid), moved, newScore };
  }

  // Move down
  function moveDown(currentGrid) {
    // Transpose, move right, then transpose back
    const transposed = transpose(currentGrid);
    const { newGrid, moved, newScore } = moveRight(transposed);
    return { newGrid: transpose(newGrid), moved, newScore };
  }

  function moveGrid(direction) {
    if (gameOver || isPaused) return;

    let result;
    switch (direction) {
      case 'ArrowLeft':
        result = moveLeft(grid);
        break;
      case 'ArrowRight':
        result = moveRight(grid);
        break;
      case 'ArrowUp':
        result = moveUp(grid);
        break;
      case 'ArrowDown':
        result = moveDown(grid);
        break;
      default:
        return;
    }

    const { newGrid, moved, newScore } = result;

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      saveScore('2048', newScore);

      // Check for game over
      if (isGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  }

  function isGameOver(currentGrid) {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) return false;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && currentGrid[i][j] === currentGrid[i + 1][j]) ||
          (j < 3 && currentGrid[i][j] === currentGrid[i][j + 1])
        ) {
          return false;
        }
      }
    }
    return true;
  }
  
  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  // Handle keyboard events
  useEffect(() => {
    function handleKeyDown(e) {
      if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        moveGrid(e.key);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, isPaused, score]);

  // Handle touch events for mobile 
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    
    function handleTouchStart(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
      if (gameOver || isPaused) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      // Determine swipe direction based on the greatest absolute difference
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 20) {
          moveGrid('ArrowRight');
        } else if (dx < -20) {
          moveGrid('ArrowLeft');
        }
      } else {
        // Vertical swipe
        if (dy > 20) {
          moveGrid('ArrowDown');
        } else if (dy < -20) {
          moveGrid('ArrowUp');
        }
      }
    }
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [grid, gameOver, isPaused, score]);

  // Get cell background color
  function getCellColor(value) {
    if (value === 0) return '#0f172a'; // Koyu arka plan rengi
    
    const colors = {
      2: '#374151',
      4: '#4b5563',
      8: '#6366f1',
      16: '#4f46e5',
      32: '#4338ca',
      64: '#3730a3',
      128: '#312e81',
      256: '#1e3a8a',
      512: '#1e40af',
      1024: '#1e4d8d',
      2048: '#1e5fb3'
    };
    return colors[value] || '#1e40af';
  }

  // Get text color based on tile value
  function getTextColor(value) {
    return value <= 4 ? 'text-gray-300' : 'text-white';
  }

  // Get font size based on tile value
  function getFontSize(value) {
    if (value <= 64) return 'text-2xl';
    if (value <= 512) return 'text-xl';
    return 'text-lg';
  }

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
          {/* Game Content */}
          <div className="flex items-center justify-center h-full w-full bg-[#0f172a]">
            <div className="grid grid-cols-4 gap-2 p-6 bg-[#0f172a] rounded-lg border-4 border-white shadow-xl">
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-md transition-colors ${cell !== 0 ? 'shadow-md' : ''}`}
                    style={{ backgroundColor: getCellColor(cell) }}
                  >
                    {cell !== 0 && (
                      <span
                        className="font-bold"
                        style={{ color: cell > 4 ? '#f9f6f2' : '#776e65', fontSize: cell > 100 ? '1.5rem' : '2rem' }}
                      >
                        {cell}
                      </span>
                    )}
                  </div>
                ))
              ))}
            </div>
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-center p-8 rounded-lg border-4 border-white shadow-xl">
                <h2 className="text-white text-6xl font-bold mb-4">Game Over</h2>
                <p className="text-white text-2xl mb-8">Your score: {score}</p>
                <div className="space-x-4">
                  <button
                    onClick={initGame}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Play Again
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

export default Game2048;

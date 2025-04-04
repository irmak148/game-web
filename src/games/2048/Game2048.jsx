import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const GRID_SIZE = 4;
const CELL_SIZE = 100;
const CELL_SPACING = 10;

class Game2048Scene extends Phaser.Scene {
  constructor() {
    super({ key: '2048' });
    this.grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    this.tiles = [];
  }

  preload() {
    // Gerekli asset'leri yükle
    this.load.image('tile', '/games/2048/tile.png');
  }

  create() {
    this.createGrid();
    this.addNewTile();
    this.addNewTile();

    // Klavye kontrolleri
    this.input.keyboard.on('keydown-LEFT', () => this.move('left'));
    this.input.keyboard.on('keydown-RIGHT', () => this.move('right'));
    this.input.keyboard.on('keydown-UP', () => this.move('up'));
    this.input.keyboard.on('keydown-DOWN', () => this.move('down'));
  }

  createGrid() {
    const startX = (this.cameras.main.width - (GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_SPACING)) / 2;
    const startY = (this.cameras.main.height - (GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_SPACING)) / 2;

    // Izgara arkaplanı
    const graphics = this.add.graphics();
    graphics.fillStyle(0x2C3E50, 1);
    graphics.fillRect(
      startX - CELL_SPACING,
      startY - CELL_SPACING,
      GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * CELL_SPACING,
      GRID_SIZE * CELL_SIZE + (GRID_SIZE + 1) * CELL_SPACING
    );

    // Boş hücreler
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = startX + col * (CELL_SIZE + CELL_SPACING);
        const y = startY + row * (CELL_SIZE + CELL_SPACING);

        graphics.fillStyle(0x34495E, 1);
        graphics.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  addNewTile() {
    const emptyCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = Phaser.Math.RND.pick(emptyCells);
      const value = Math.random() < 0.9 ? 2 : 4;
      this.grid[row][col] = value;
      this.createTile(row, col, value);
    }
  }

  createTile(row, col, value) {
    const startX = (this.cameras.main.width - (GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_SPACING)) / 2;
    const startY = (this.cameras.main.height - (GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_SPACING)) / 2;

    const x = startX + col * (CELL_SIZE + CELL_SPACING) + CELL_SIZE / 2;
    const y = startY + row * (CELL_SIZE + CELL_SPACING) + CELL_SIZE / 2;

    const tile = this.add.sprite(x, y, 'tile');
    tile.setScale(CELL_SIZE / tile.width);
    
    const text = this.add.text(x, y, value.toString(), {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.tiles.push({ sprite: tile, text, value, row, col });
  }

  move(direction) {
    let moved = false;
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));

    if (direction === 'left' || direction === 'right') {
      for (let row = 0; row < GRID_SIZE; row++) {
        const line = this.grid[row].filter(cell => cell !== 0);
        const merged = [];
        
        if (direction === 'right') line.reverse();

        for (let i = 0; i < line.length - 1; i++) {
          if (line[i] === line[i + 1] && !merged.includes(i)) {
            line[i] *= 2;
            line.splice(i + 1, 1);
            merged.push(i);
            moved = true;
          }
        }

        const filled = line.length;
        const empty = GRID_SIZE - filled;
        const newLine = direction === 'left'
          ? [...line, ...Array(empty).fill(0)]
          : [...Array(empty).fill(0), ...line.reverse()];

        newGrid[row] = newLine;
      }
    }

    if (moved) {
      this.grid = newGrid;
      this.updateTiles();
      this.addNewTile();
    }
  }

  updateTiles() {
    // Mevcut karoları temizle
    this.tiles.forEach(tile => {
      tile.sprite.destroy();
      tile.text.destroy();
    });
    this.tiles = [];

    // Yeni karoları oluştur
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = this.grid[row][col];
        if (value !== 0) {
          this.createTile(row, col, value);
        }
      }
    }
  }
}

function Game2048() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#1a1a1a',
      scene: Game2048Scene
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div ref={gameRef} className="rounded-lg overflow-hidden shadow-2xl" />
    </div>
  );
}

export default Game2048;

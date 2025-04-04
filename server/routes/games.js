import express from 'express';
import Game from '../models/Game.js';

const router = express.Router();

// Tüm oyunları getir
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kategori bazlı oyunları getir
router.get('/category/:category', async (req, res) => {
  try {
    const games = await Game.find({ category: req.params.category });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Popüler oyunları getir
router.get('/popular', async (req, res) => {
  try {
    const games = await Game.find().sort({ playCount: -1 }).limit(10);
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni oyun ekle
router.post('/', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Oyun güncelle
router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Oyun sil
router.delete('/:id', async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Oyun silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

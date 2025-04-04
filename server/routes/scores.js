import express from 'express';
import Score from '../models/Score.js';

const router = express.Router();

// Yeni skor kaydet
router.post('/', async (req, res) => {
  try {
    const score = new Score(req.body);
    await score.save();
    res.status(201).json(score);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Oyun için en yüksek skorları getir
router.get('/game/:gameId', async (req, res) => {
  try {
    const scores = await Score.find({ game: req.params.gameId })
      .sort({ score: -1 })
      .limit(10)
      .populate('user', 'username');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcının skorlarını getir
router.get('/user/:userId', async (req, res) => {
  try {
    const scores = await Score.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('game', 'title');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

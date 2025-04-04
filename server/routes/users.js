import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kullanıcı profili güncelleme
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Kullanıcı başarımları
router.get('/:id/achievements', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user.achievements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Favori oyunlar
router.get('/:id/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favoriteGames');
    res.json(user.favoriteGames);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

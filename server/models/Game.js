import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Aksiyon', 'Bulmaca', 'Strateji', 'Çok Oyunculu', 'Çocuk Oyunları']
  },
  thumbnail: {
    type: String,
    required: true
  },
  gameUrl: {
    type: String,
    required: true
  },
  isMultiplayer: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  playCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Game', gameSchema);
